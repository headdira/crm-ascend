"use server";

import { serviceUpsertSchema } from "@crm-ascend/validation";
import { revalidatePath } from "next/cache";
import { ActionError } from "@/lib/errors";
import { requireStaff } from "@/lib/auth";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function listServices() {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase.from("services").select("*").order("name");
  if (error) throw new ActionError(error.message, "DB_ERROR");
  return data ?? [];
}

export async function upsertService(input: unknown) {
  await requireStaff();
  const parsed = serviceUpsertSchema.parse(input);
  const supabase = await getSupabaseServer();

  const { id, ...payload } = parsed;

  if (id) {
    const { data, error } = await supabase
      .from("services")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new ActionError(error.message, "DB_ERROR");
    revalidatePath("/crm/services");
    return data;
  }

  const { data, error } = await supabase.from("services").insert(payload).select().single();
  if (error) throw new ActionError(error.message, "DB_ERROR");
  revalidatePath("/crm/services");
  return data;
}
