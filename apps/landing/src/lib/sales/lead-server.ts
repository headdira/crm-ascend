import type { Json } from "@crm-ascend/db";
import { createServiceSupabase } from "@crm-ascend/db";
import { hashEmail, hashPhone } from "@crm-ascend/validation";
import { getHashSalt } from "@/lib/env";

export async function upsertCheckoutLead(input: {
  full_name: string;
  email: string;
  phone: string;
  utm?: Json;
}) {
  const supabase = createServiceSupabase();
  const salt = getHashSalt();
  const now = new Date().toISOString();
  const emailHash = hashEmail(input.email, salt);
  const phoneHash = hashPhone(input.phone, salt);

  const { data: existing } = await supabase
    .from("leads")
    .select("id")
    .eq("email_hash", emailHash)
    .eq("source", "landing")
    .maybeSingle();

  const base = {
    full_name: input.full_name.trim(),
    email_hash: emailHash,
    phone_hash: phoneHash,
    email_enc: input.email.trim().toLowerCase(),
    phone_enc: input.phone.trim(),
    utm: (input.utm ?? {}) as Json,
    quiz_answers: { marketing_consent: true, checkout_flow: true } as Json,
    last_event_at: now,
    reached_kiwify_at: now,
  };

  if (existing) {
    const { data, error } = await supabase
      .from("leads")
      .update(base)
      .eq("id", existing.id)
      .select("id")
      .single();
    if (error) throw error;
    return data.id;
  }

  const { data, error } = await supabase
    .from("leads")
    .insert({
      ...base,
      source: "landing",
      status: "new",
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}
