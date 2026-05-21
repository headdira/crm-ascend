"use server";

import type { TablesUpdate } from "@crm-ascend/db";
import {
  hashDocument,
  hashEmail,
  hashPhone,
  studentUpdateSchema,
} from "@crm-ascend/validation";
import { revalidatePath } from "next/cache";
import { ActionError } from "@/lib/errors";
import { requireStaff } from "@/lib/auth";
import { getHashSalt } from "@/lib/env";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function listStudents(filters?: { q?: string; status?: string }) {
  const supabase = await getSupabaseServer();
  let query = supabase.from("students").select("*").order("created_at", { ascending: false });
  if (filters?.status) {
    query = query.eq("status", filters.status as "prospect" | "active" | "inactive");
  }
  if (filters?.q) query = query.ilike("full_name", `%${filters.q}%`);
  const { data, error } = await query;
  if (error) throw new ActionError(error.message, "DB_ERROR");
  return data ?? [];
}

export async function getStudent(id: string) {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase.from("students").select("*").eq("id", id).single();
  if (error) throw new ActionError(error.message, "NOT_FOUND");
  return data;
}

export async function getStudent360(id: string) {
  const supabase = await getSupabaseServer();
  const [studentRes, contracts, enrollments, cases] = await Promise.all([
    supabase.from("students").select("*").eq("id", id).single(),
    supabase.from("contracts").select("*").eq("student_id", id).order("created_at", {
      ascending: false,
    }),
    supabase.from("enrollments").select("*").eq("student_id", id).order("created_at", {
      ascending: false,
    }),
    supabase.from("cases").select("*").eq("student_id", id).order("created_at", {
      ascending: false,
    }),
  ]);

  if (studentRes.error || !studentRes.data) {
    throw new ActionError(studentRes.error?.message ?? "Aluno não encontrado", "NOT_FOUND");
  }

  const enrollmentProductIds = [...new Set((enrollments.data ?? []).map((e) => e.product_id))];
  const serviceIds = [...new Set((cases.data ?? []).map((c) => c.service_id))];

  const [{ data: enrollmentProducts }, { data: services }] = await Promise.all([
    enrollmentProductIds.length
      ? supabase
          .from("products")
          .select("id, name, sku, product_type")
          .in("id", enrollmentProductIds)
      : Promise.resolve({ data: [] }),
    serviceIds.length
      ? supabase.from("services").select("id, name, code").in("id", serviceIds)
      : Promise.resolve({ data: [] }),
  ]);

  const productMap = new Map((enrollmentProducts ?? []).map((p) => [p.id, p]));
  const serviceMap = new Map((services ?? []).map((s) => [s.id, s]));

  return {
    student: studentRes.data,
    contracts: contracts.data ?? [],
    enrollments: (enrollments.data ?? []).map((e) => ({
      ...e,
      products: productMap.get(e.product_id) ?? null,
    })),
    cases: (cases.data ?? []).map((c) => ({
      ...c,
      services: serviceMap.get(c.service_id) ?? null,
    })),
  };
}

export async function updateStudent(id: string, input: unknown) {
  await requireStaff();
  const parsed = studentUpdateSchema.parse(input);
  const salt = getHashSalt();
  const patch: Record<string, unknown> = { ...parsed };

  if (parsed.email) {
    patch.email_hash = hashEmail(parsed.email, salt);
    delete patch.email;
  }
  if (parsed.phone !== undefined) {
    patch.phone_hash = parsed.phone ? hashPhone(parsed.phone, salt) : null;
  }
  if (parsed.document !== undefined) {
    patch.document_hash = parsed.document ? hashDocument(parsed.document, salt) : null;
  }

  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("students")
    .update(patch as TablesUpdate<"students">)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new ActionError(error.message, "DB_ERROR");
  revalidatePath("/crm/students");
  revalidatePath(`/crm/students/${id}`);
  return data;
}
