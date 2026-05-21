"use server";

import { contractActivateSchema, contractCreateSchema } from "@crm-ascend/validation";
import { revalidatePath } from "next/cache";
import { ActionError } from "@/lib/errors";
import { requireStaff } from "@/lib/auth";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function listContracts() {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("contracts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new ActionError(error.message, "DB_ERROR");
  return data ?? [];
}

export async function getContract(id: string) {
  const supabase = await getSupabaseServer();
  const { data: contract, error } = await supabase
    .from("contracts")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !contract) throw new ActionError(error?.message ?? "NOT_FOUND", "NOT_FOUND");

  const [student, lines] = await Promise.all([
    supabase.from("students").select("full_name").eq("id", contract.student_id).single(),
    supabase.from("contract_lines").select("*").eq("contract_id", id),
  ]);

  const productIds = [...new Set((lines.data ?? []).map((l) => l.product_id))];
  const { data: products } =
    productIds.length > 0
      ? await supabase.from("products").select("id, name, sku, product_type").in("id", productIds)
      : { data: [] };
  const productMap = new Map((products ?? []).map((p) => [p.id, p]));

  return {
    ...contract,
    students: student.data,
    contract_lines: (lines.data ?? []).map((l) => ({
      ...l,
      products: productMap.get(l.product_id) ?? null,
    })),
  };
}

export async function createContract(input: unknown) {
  const staff = await requireStaff();
  const parsed = contractCreateSchema.parse(input);
  const supabase = await getSupabaseServer();

  const total = parsed.lines.reduce(
    (sum, l) => sum + l.quantity * l.unit_price_cents,
    0,
  );

  const { data: contract, error: contractErr } = await supabase
    .from("contracts")
    .insert({
      student_id: parsed.student_id,
      starts_at: parsed.starts_at,
      ends_at: parsed.ends_at,
      notes: parsed.notes ?? null,
      total_amount_cents: total,
      created_by: staff.id,
      status: "draft",
    })
    .select()
    .single();

  if (contractErr || !contract) {
    throw new ActionError(contractErr?.message ?? "Erro ao criar contrato", "DB_ERROR");
  }

  const lines = parsed.lines.map((l) => ({
    contract_id: contract.id,
    product_id: l.product_id,
    quantity: l.quantity,
    unit_price_cents: l.unit_price_cents,
  }));

  const { error: linesErr } = await supabase.from("contract_lines").insert(lines);
  if (linesErr) throw new ActionError(linesErr.message, "DB_ERROR");

  revalidatePath("/crm/contracts");
  return contract;
}

export async function activateContract(input: unknown) {
  await requireStaff();
  const { contract_id } = contractActivateSchema.parse(input);
  const supabase = await getSupabaseServer();

  const { data: contract, error: cErr } = await supabase
    .from("contracts")
    .select("*")
    .eq("id", contract_id)
    .single();

  if (cErr || !contract) throw new ActionError("Contrato não encontrado", "NOT_FOUND");
  if (contract.status !== "draft") {
    throw new ActionError("Apenas contratos em rascunho podem ser ativados", "INVALID_STATUS");
  }

  const { data: lines, error: linesErr } = await supabase
    .from("contract_lines")
    .select("id, product_id")
    .eq("contract_id", contract_id);

  if (linesErr) throw new ActionError(linesErr.message, "DB_ERROR");
  if (!lines?.length) {
    throw new ActionError("Contrato precisa de ao menos uma linha", "NO_LINES");
  }

  const now = new Date().toISOString();
  const { error: statusErr } = await supabase
    .from("contracts")
    .update({ status: "active" })
    .eq("id", contract_id);

  if (statusErr) throw new ActionError(statusErr.message, "DB_ERROR");

  const enrollments = lines.map((line) => ({
    student_id: contract.student_id,
    product_id: line.product_id,
    contract_line_id: line.id,
    status: "active" as const,
    starts_at: now,
    ends_at: contract.ends_at ? `${contract.ends_at}T23:59:59Z` : null,
  }));

  const { error: enrollErr } = await supabase.from("enrollments").insert(enrollments);
  if (enrollErr) {
    await supabase.from("contracts").update({ status: "draft" }).eq("id", contract_id);
    throw new ActionError(enrollErr.message, "DB_ERROR");
  }

  await supabase
    .from("students")
    .update({ status: "active" })
    .eq("id", contract.student_id)
    .eq("status", "prospect");

  revalidatePath("/crm/contracts");
  revalidatePath(`/crm/contracts/${contract_id}`);
  revalidatePath(`/crm/students/${contract.student_id}`);
  return { contract_id };
}
