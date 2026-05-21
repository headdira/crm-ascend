"use server";

import type { Json, TablesUpdate } from "@crm-ascend/db";
import {
  hashEmail,
  hashPhone,
  leadConvertSchema,
  leadCreateSchema,
  leadUpdateSchema,
} from "@crm-ascend/validation";
import { revalidatePath } from "next/cache";
import { ActionError } from "@/lib/errors";
import { requireStaff } from "@/lib/auth";
import { getHashSalt } from "@/lib/env";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function listLeads(filters?: {
  status?: string;
  q?: string;
}) {
  const supabase = await getSupabaseServer();
  let query = supabase.from("leads").select("*").order("created_at", { ascending: false });

  if (filters?.status) {
    query = query.eq(
      "status",
      filters.status as "new" | "contacted" | "qualified" | "disqualified" | "converted",
    );
  }
  if (filters?.q) query = query.ilike("full_name", `%${filters.q}%`);

  const { data, error } = await query;
  if (error) throw new ActionError(error.message, "DB_ERROR");
  return data ?? [];
}

export async function getLead(id: string) {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase.from("leads").select("*").eq("id", id).single();
  if (error) throw new ActionError(error.message, "NOT_FOUND");
  return data;
}

export async function getLeadTrackingContext(leadId: string) {
  const lead = await getLead(leadId);
  const supabase = await getSupabaseServer();

  if (!lead.session_id) {
    return { lead, session: null, events: [] };
  }

  const [{ data: session }, events] = await Promise.all([
    supabase.from("landing_sessions").select("*").eq("id", lead.session_id).maybeSingle(),
    listSessionEvents(lead.session_id),
  ]);

  return { lead, session, events };
}

async function listSessionEvents(sessionId: string) {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("landing_events")
    .select("*")
    .eq("session_id", sessionId)
    .order("ts", { ascending: false })
    .limit(100);

  if (error) throw new ActionError(error.message, "DB_ERROR");
  return data ?? [];
}

export async function createLead(input: unknown) {
  await requireStaff();
  const parsed = leadCreateSchema.parse(input);
  const salt = getHashSalt();
  const supabase = await getSupabaseServer();

  const { data, error } = await supabase
    .from("leads")
    .insert({
      full_name: parsed.full_name,
      email_hash: hashEmail(parsed.email, salt),
      phone_hash: parsed.phone ? hashPhone(parsed.phone, salt) : null,
      email_enc: parsed.email,
      phone_enc: parsed.phone ?? null,
      source: parsed.source,
      utm: (parsed.utm ?? {}) as Json,
      quiz_answers: (parsed.quiz_answers ?? {}) as Json,
      owner_id: parsed.owner_id ?? null,
    })
    .select()
    .single();

  if (error) throw new ActionError(error.message, "DB_ERROR");
  revalidatePath("/crm/leads");
  return data;
}

export async function updateLead(id: string, input: unknown) {
  await requireStaff();
  const parsed = leadUpdateSchema.parse(input);
  const salt = getHashSalt();
  const supabase = await getSupabaseServer();

  const patch: Record<string, unknown> = { ...parsed };
  if (parsed.email) {
    patch.email_hash = hashEmail(parsed.email, salt);
    patch.email_enc = parsed.email;
    delete patch.email;
  }
  if (parsed.phone !== undefined) {
    patch.phone_hash = parsed.phone ? hashPhone(parsed.phone, salt) : null;
    patch.phone_enc = parsed.phone ?? null;
    delete patch.phone;
  }

  const { data, error } = await supabase
    .from("leads")
    .update(patch as TablesUpdate<"leads">)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new ActionError(error.message, "DB_ERROR");
  revalidatePath("/crm/leads");
  revalidatePath(`/crm/leads/${id}`);
  return data;
}

export async function convertLeadToStudent(input: unknown) {
  const staff = await requireStaff();
  const { lead_id, notes } = leadConvertSchema.parse(input);
  const salt = getHashSalt();
  const supabase = await getSupabaseServer();

  const { data: lead, error: leadErr } = await supabase
    .from("leads")
    .select("*")
    .eq("id", lead_id)
    .single();

  if (leadErr || !lead) throw new ActionError("Lead não encontrado", "NOT_FOUND");
  if (lead.status === "converted" && lead.converted_student_id) {
    throw new ActionError("Lead já convertido", "ALREADY_CONVERTED");
  }

  const { data: existing } = await supabase
    .from("students")
    .select("id")
    .eq("email_hash", lead.email_hash)
    .maybeSingle();

  if (existing) {
    throw new ActionError("Já existe aluno com este e-mail", "DUPLICATE_STUDENT");
  }

  const { data: student, error: studentErr } = await supabase
    .from("students")
    .insert({
      full_name: lead.full_name,
      email_hash: lead.email_hash,
      phone_hash: lead.phone_hash,
      email: lead.email_enc,
      phone: lead.phone_enc,
      status: "prospect",
      converted_from_lead_id: lead.id,
      notes: notes ?? null,
    })
    .select()
    .single();

  if (studentErr || !student) {
    throw new ActionError(studentErr?.message ?? "Erro ao criar aluno", "DB_ERROR");
  }

  const { error: updateErr } = await supabase
    .from("leads")
    .update({
      status: "converted",
      converted_student_id: student.id,
    })
    .eq("id", lead_id);

  if (updateErr) throw new ActionError(updateErr.message, "DB_ERROR");

  revalidatePath("/crm/leads");
  revalidatePath(`/crm/leads/${lead_id}`);
  revalidatePath("/crm/students");
  return { student, staffId: staff.id };
}

export async function discardLead(id: string) {
  await requireStaff();
  const supabase = await getSupabaseServer();
  const { error } = await supabase
    .from("leads")
    .update({ status: "disqualified" })
    .eq("id", id);
  if (error) throw new ActionError(error.message, "DB_ERROR");
  revalidatePath("/crm/leads");
  revalidatePath(`/crm/leads/${id}`);
}
