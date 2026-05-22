import type { Json } from "@crm-ascend/db";
import { createServiceSupabase } from "@crm-ascend/db";
import { hashEmail, hashPhone } from "@crm-ascend/validation";
import { getHashSalt } from "@/lib/env";
import { ctaLabel } from "@/lib/sales/cta-labels";
import {
  getSessionIdFromRequest,
  upsertIdentifiedLead,
  upsertLandingSession,
} from "@/lib/sales/tracking-server";

export type CheckoutTracking = {
  cta?: string;
  cta_label?: string;
};

function buildQuizAnswers(
  tracking: CheckoutTracking | undefined,
  extra: Record<string, unknown>,
): Json {
  return {
    marketing_consent: true,
    checkout_flow: true,
    initial_cta: tracking?.cta ?? null,
    initial_cta_label: tracking?.cta_label ?? null,
    ...extra,
  } as Json;
}

export async function upsertCheckoutLead(
  request: Request,
  input: {
    full_name: string;
    email: string;
    phone: string;
    utm?: Json;
    tracking?: CheckoutTracking;
  },
) {
  const sessionId = getSessionIdFromRequest(request);
  const now = new Date().toISOString();

  if (sessionId) {
    await upsertLandingSession(request, sessionId);
    const id = await upsertIdentifiedLead(request, sessionId, {
      full_name: input.full_name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(),
    });

    const supabase = createServiceSupabase();
    await supabase
      .from("leads")
      .update({
        utm: (input.utm ?? {}) as Json,
        quiz_answers: buildQuizAnswers(input.tracking, {
          checkout_completed: true,
          reached_kiwify: true,
        }),
        reached_kiwify_at: now,
        last_event_at: now,
      })
      .eq("id", id);

    return id;
  }

  const supabase = createServiceSupabase();
  const salt = getHashSalt();
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
    quiz_answers: buildQuizAnswers(input.tracking, {
      checkout_completed: true,
      reached_kiwify: true,
    }),
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

export async function upsertCheckoutAbandon(
  request: Request,
  input: {
    step: "name" | "email" | "phone";
    cta?: string;
    first_name?: string;
    email?: string;
    phone?: string;
    utm?: Json;
  },
) {
  const sessionId = getSessionIdFromRequest(request);
  if (!sessionId) return null;

  await upsertLandingSession(request, sessionId);
  const now = new Date().toISOString();
  const tracking: CheckoutTracking = {
    cta: input.cta,
    cta_label: ctaLabel(input.cta),
  };

  const partial: Record<string, unknown> = {
    checkout_abandoned: true,
    abandoned_at: now,
    abandoned_step: input.step,
    filled_fields: [
      input.first_name ? "name" : null,
      input.email ? "email" : null,
      input.phone ? "phone" : null,
    ].filter(Boolean),
  };

  const supabase = createServiceSupabase();
  const salt = getHashSalt();

  const { data: sessionLead } = await supabase
    .from("leads")
    .select("id, email_enc")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (input.email) {
    const email = input.email.trim().toLowerCase();
    const id = await upsertIdentifiedLead(request, sessionId, {
      full_name: (input.first_name?.trim().split(/\s+/)[0] || "Visitante (site)").slice(0, 80),
      email,
      phone: input.phone?.replace(/\D/g, "") || undefined,
    });

    await supabase
      .from("leads")
      .update({
        utm: (input.utm ?? {}) as Json,
        quiz_answers: buildQuizAnswers(tracking, partial),
        last_event_at: now,
        reached_kiwify_at: null,
      })
      .eq("id", id);

    return id;
  }

  if (sessionLead) {
    await supabase
      .from("leads")
      .update({
        quiz_answers: buildQuizAnswers(tracking, partial),
        last_event_at: now,
      })
      .eq("id", sessionLead.id);
    return sessionLead.id;
  }

  const emailHash = hashEmail(`abandon:${sessionId}`, salt);
  const { data, error } = await supabase
    .from("leads")
    .insert({
      full_name: input.first_name?.trim().split(/\s+/)[0] || "Visitante (site)",
      email_hash: emailHash,
      source: "landing",
      session_id: sessionId,
      utm: (input.utm ?? {}) as Json,
      quiz_answers: buildQuizAnswers(tracking, partial),
      status: "new",
      last_event_at: now,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}
