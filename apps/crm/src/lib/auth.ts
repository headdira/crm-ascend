import type { Tables } from "@crm-ascend/db";
import { getSupabaseServer } from "@/lib/supabase/server";

export type StaffUser = Tables<"staff_users">;

export async function getSessionUser() {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentStaff(): Promise<StaffUser | null> {
  const supabase = await getSupabaseServer();
  const user = await getSessionUser();
  if (!user) return null;

  const { data } = await supabase
    .from("staff_users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return data;
}

export async function requireStaff(): Promise<StaffUser> {
  const staff = await getCurrentStaff();
  if (!staff?.is_active) {
    throw new Error("Staff não autorizado");
  }
  return staff;
}
