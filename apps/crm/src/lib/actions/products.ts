"use server";

import type { Json, TablesUpdate } from "@crm-ascend/db";
import { productCreateSchema, productUpdateSchema } from "@crm-ascend/validation";
import { revalidatePath } from "next/cache";
import { ActionError } from "@/lib/errors";
import { requireStaff } from "@/lib/auth";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function listProducts(activeOnly = false) {
  const supabase = await getSupabaseServer();
  let query = supabase.from("products").select("*").order("name");
  if (activeOnly) query = query.eq("is_active", true);
  const { data, error } = await query;
  if (error) throw new ActionError(error.message, "DB_ERROR");
  return data ?? [];
}

export async function getProduct(id: string) {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
  if (error) throw new ActionError(error.message, "NOT_FOUND");
  return data;
}

export async function createProduct(input: unknown) {
  await requireStaff();
  const parsed = productCreateSchema.parse(input);
  const supabase = await getSupabaseServer();
  const row = {
    ...parsed,
    metadata: (parsed.metadata ?? {}) as Json,
  };
  const { data, error } = await supabase.from("products").insert(row).select().single();
  if (error) throw new ActionError(error.message, "DB_ERROR");
  revalidatePath("/crm/products");
  return data;
}

export async function updateProduct(id: string, input: unknown) {
  await requireStaff();
  const parsed = productUpdateSchema.parse(input);
  const supabase = await getSupabaseServer();
  const { metadata, ...rest } = parsed;
  const patch: TablesUpdate<"products"> = { ...rest };
  if (metadata !== undefined) {
    patch.metadata = metadata as Json;
  }
  const { data, error } = await supabase
    .from("products")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new ActionError(error.message, "DB_ERROR");
  revalidatePath("/crm/products");
  revalidatePath(`/crm/products/${id}`);
  return data;
}

export async function deactivateProduct(id: string) {
  await requireStaff();
  const supabase = await getSupabaseServer();
  const { error } = await supabase.from("products").update({ is_active: false }).eq("id", id);
  if (error) throw new ActionError(error.message, "DB_ERROR");
  revalidatePath("/crm/products");
}
