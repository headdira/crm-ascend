import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@crm-ascend/db";

type LeadRow = Database["public"]["Tables"]["leads"]["Row"];

export async function findLeadByCustomerEmail(
  supabase: SupabaseClient<Database>,
  emailHash: string,
  email?: string | null,
): Promise<LeadRow | null> {
  const { data: byHash } = await supabase
    .from("leads")
    .select("*")
    .eq("email_hash", emailHash)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (byHash) return byHash;

  const normalized = email?.trim().toLowerCase();
  if (!normalized) return null;

  const { data: byEmail } = await supabase
    .from("leads")
    .select("*")
    .ilike("email_enc", normalized)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return byEmail;
}
