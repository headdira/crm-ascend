"use server";

import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/auth";
import { getSupabaseServer } from "@/lib/supabase/server";

/** Garante registro em staff_users após login (admin deve promover role manualmente). */
export async function syncStaffUser() {
  const user = await getSessionUser();
  if (!user?.email) return null;

  const supabase = await getSupabaseServer();
  const { data: existing } = await supabase
    .from("staff_users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) return existing;

  const { data, error } = await supabase
    .from("staff_users")
    .insert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name ?? user.email.split("@")[0],
      role: "read_only",
    })
    .select()
    .single();

  if (error) {
    console.error("syncStaffUser", error.message);
    return null;
  }

  revalidatePath("/crm");
  return data;
}

export async function listStaffUsers() {
  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("staff_users")
    .select("id, full_name, email, role")
    .eq("is_active", true)
    .order("full_name");
  return data ?? [];
}
