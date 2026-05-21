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

  if (parsed.id) {
    const { id: _updateId, ...updatePayload } = parsed;
    const { data, error } = await supabase
      .from("services")
      .update(updatePayload)
      .eq("id", parsed.id)
      .select()
      .single();
    if (error) throw new ActionError(error.message, "DB_ERROR");
    revalidatePath("/crm/services");
    return data;
  }

  const { id: _id, ...insert } = parsed;
  const { data, error } = await supabase.from("services").insert(insert).select().single();
  if (error) throw new ActionError(error.message, "DB_ERROR");
  revalidatePath("/crm/services");
  return data;
}
