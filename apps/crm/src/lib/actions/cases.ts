"use server";

import type { TablesUpdate } from "@crm-ascend/db";
import { caseCommentSchema, caseCreateSchema } from "@crm-ascend/validation";
import { revalidatePath } from "next/cache";
import { ActionError } from "@/lib/errors";
import { requireStaff } from "@/lib/auth";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function listCases(filters?: {
  status?: string;
  priority?: string;
  owner_id?: string;
  service_id?: string;
}) {
  const supabase = await getSupabaseServer();
  let query = supabase.from("cases").select("*").order("created_at", { ascending: false });

  if (filters?.status) {
    query = query.eq(
      "status",
      filters.status as "new" | "in_progress" | "waiting_customer" | "resolved" | "closed",
    );
  }
  if (filters?.priority) {
    query = query.eq("priority", filters.priority as "low" | "medium" | "high" | "critical");
  }
  if (filters?.owner_id) query = query.eq("owner_id", filters.owner_id);
  if (filters?.service_id) query = query.eq("service_id", filters.service_id);

  const { data, error } = await query;
  if (error) throw new ActionError(error.message, "DB_ERROR");
  return data ?? [];
}

export async function getCase(id: string) {
  const supabase = await getSupabaseServer();
  const { data: caseRow, error: caseErr } = await supabase
    .from("cases")
    .select("*")
    .eq("id", id)
    .single();

  if (caseErr || !caseRow) {
    throw new ActionError(caseErr?.message ?? "Caso não encontrado", "NOT_FOUND");
  }

  const [comments, staffList, student, service] = await Promise.all([
    supabase
      .from("case_comments")
      .select("*")
      .eq("case_id", id)
      .order("created_at", { ascending: true }),
    supabase.from("staff_users").select("id, full_name").eq("is_active", true),
    supabase.from("students").select("full_name").eq("id", caseRow.student_id).maybeSingle(),
    supabase.from("services").select("name, code").eq("id", caseRow.service_id).maybeSingle(),
  ]);

  const authorIds = [...new Set((comments.data ?? []).map((c) => c.author_id))];
  const { data: authors } =
    authorIds.length > 0
      ? await supabase.from("staff_users").select("id, full_name").in("id", authorIds)
      : { data: [] };
  const authorMap = new Map((authors ?? []).map((a) => [a.id, a.full_name]));

  return {
    case: {
      ...caseRow,
      students: student.data,
      services: service.data,
    },
    comments: (comments.data ?? []).map((c) => ({
      ...c,
      staff_users: { full_name: authorMap.get(c.author_id) ?? "—" },
    })),
    staffList: staffList.data ?? [],
  };
}

export async function createCase(input: unknown) {
  const staff = await requireStaff();
  const parsed = caseCreateSchema.parse(input);
  const supabase = await getSupabaseServer();

  const { data: service } = await supabase
    .from("services")
    .select("default_priority")
    .eq("id", parsed.service_id)
    .single();

  const { data, error } = await supabase
    .from("cases")
    .insert({
      ...parsed,
      priority: parsed.priority ?? service?.default_priority ?? "medium",
      owner_id: parsed.owner_id ?? staff.id,
    })
    .select()
    .single();

  if (error) throw new ActionError(error.message, "DB_ERROR");
  revalidatePath("/crm/cases");
  revalidatePath(`/crm/students/${parsed.student_id}`);
  return data;
}

export async function updateCase(
  id: string,
  patch: {
    status?: string;
    priority?: string;
    owner_id?: string | null;
    subject?: string;
    description?: string;
  },
) {
  await requireStaff();
  const supabase = await getSupabaseServer();
  const update: Record<string, unknown> = { ...patch };
  if (patch.status === "resolved" || patch.status === "closed") {
    update.resolved_at = new Date().toISOString();
  }
  const { data, error } = await supabase
    .from("cases")
    .update(update as TablesUpdate<"cases">)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new ActionError(error.message, "DB_ERROR");
  revalidatePath("/crm/cases");
  revalidatePath(`/crm/cases/${id}`);
  return data;
}

export async function addCaseComment(input: unknown) {
  const staff = await requireStaff();
  const parsed = caseCommentSchema.parse(input);
  const supabase = await getSupabaseServer();

  const { data, error } = await supabase
    .from("case_comments")
    .insert({
      case_id: parsed.case_id,
      body: parsed.body,
      is_internal: parsed.is_internal ?? true,
      author_id: staff.id,
    })
    .select()
    .single();

  if (error) throw new ActionError(error.message, "DB_ERROR");
  revalidatePath(`/crm/cases/${parsed.case_id}`);
  return data;
}
