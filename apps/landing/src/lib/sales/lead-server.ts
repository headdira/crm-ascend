import type { Json } from "@crm-ascend/db";
import { createServiceSupabase } from "@crm-ascend/db";
import { hashEmail, hashPhone, hashIdentifier } from "@crm-ascend/validation";
import { getHashSalt } from "@/lib/env";
import { ctaLabel } from "@/lib/sales/cta-labels";
import { LEAD_STATUS_FRIO, LEAD_STATUS_QUENTE } from "@/lib/sales/lead-temperature";
import {
  clientContextFromRequest,
  sendMetaLeadEvent,
} from "@/lib/sales/meta-capi";
import { buildPersonalizedCheckoutUrl } from "@/lib/sales/checkout-url";
import {
  ensureColdLeadForSession,
  getSessionIdFromRequest,
  upsertIdentifiedLead,
  upsertLandingSession,
} from "@/lib/sales/tracking-server";
import { notifyDiscordLead } from "@/lib/sales/discord-lead-notify";

export type CheckoutMeta = {
  event_id: string;
  fbp?: string;
  fbc?: string;
};

export type CheckoutTracking = {
  cta?: string;
  cta_label?: string;
};

export function buildCheckoutUrlForLead(input: {
  full_name: string;
  email: string;
  phone: string;
  utm?: Json;
}): string {
  const firstName = input.full_name.trim().split(/\s+/)[0] ?? input.full_name.trim();
  const attribution =
    input.utm && typeof input.utm === "object" && !Array.isArray(input.utm)
      ? (input.utm as Record<string, string>)
      : null;

  return buildPersonalizedCheckoutUrl(
    {
      email: input.email.trim().toLowerCase(),
      name: firstName,
      phone: input.phone.replace(/\D/g, ""),
    },
    attribution,
  );
}

function metaQuizFields(meta: CheckoutMeta | undefined): Record<string, unknown> {
  if (!meta) return {};
  return {
    meta_event_id: meta.event_id,
    meta_fbp: meta.fbp ?? null,
    meta_fbc: meta.fbc ?? null,
  };
}

async function sendLeadToMetaCapi(
  request: Request,
  input: {
    full_name: string;
    email: string;
    phone: string;
    utm?: Json;
    tracking?: CheckoutTracking;
    meta?: CheckoutMeta;
    leadId: string;
    sessionId: string | null;
  },
) {
  if (!input.meta?.event_id) return;

  const { ip, userAgent } = clientContextFromRequest(request);
  const utm = (input.utm ?? {}) as Record<string, string | undefined>;
  const firstName = input.full_name.trim().split(/\s+/)[0] ?? input.full_name;

  const result = await sendMetaLeadEvent({
    eventId: input.meta.event_id,
    eventSourceUrl: request.headers.get("referer") ?? undefined,
    userData: {
      email: input.email,
      phone: input.phone,
      firstName,
      clientIp: ip,
      clientUserAgent: userAgent,
      fbp: input.meta.fbp ?? null,
      fbc: input.meta.fbc ?? null,
      externalId: input.sessionId ?? input.leadId,
    },
    customData: {
      cta: input.tracking?.cta,
      utm_source: utm.utm_source,
      utm_campaign: utm.utm_campaign,
      utm_medium: utm.utm_medium,
      lead_id: input.leadId,
    },
  });

  if (!result.ok && !result.skipped) {
    console.error("[lead-server] Meta CAPI Lead failed:", result.error);
  }
}

function buildQuizAnswers(
  tracking: CheckoutTracking | undefined,
  extra: Record<string, unknown>,
): Record<string, unknown> {
  return {
    lead_temperature: "quente",
    marketing_consent: true,
    checkout_flow: true,
    initial_cta: tracking?.cta ?? null,
    initial_cta_label: tracking?.cta_label ?? null,
    ...extra,
  };
}

export async function upsertCheckoutLead(
  request: Request,
  input: {
    full_name: string;
    email: string;
    phone: string;
    utm?: Json;
    tracking?: CheckoutTracking;
    meta?: CheckoutMeta;
    quiz_extra?: Record<string, unknown>;
  },
): Promise<{ id: string; checkout_url: string }> {
  const checkout_url = buildCheckoutUrlForLead(input);
  const sessionId = getSessionIdFromRequest(request);
  const now = new Date().toISOString();
  const metaFields = metaQuizFields(input.meta);

  if (sessionId) {
    await upsertLandingSession(request, sessionId);
    const id = await upsertIdentifiedLead(request, sessionId, {
      full_name: input.full_name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(),
    });

    const supabase = createServiceSupabase();
    const { data: lead } = await supabase
      .from("leads")
      .select("quiz_answers")
      .eq("id", id)
      .single();

    const prev = (lead?.quiz_answers ?? {}) as Record<string, unknown>;

    await supabase
      .from("leads")
      .update({
        utm: (input.utm ?? {}) as Json,
        quiz_answers: buildQuizAnswers(input.tracking, {
          ...prev,
          ...metaFields,
          ...(input.quiz_extra ?? {}),
          checkout_completed: true,
          reached_kiwify: true,
          kiwify_checkout_pending: true,
          kiwify_checkout_started_at: now,
          kiwify_checkout_abandoned: false,
        }) as Json,
        reached_kiwify_at: now,
        last_event_at: now,
        status: LEAD_STATUS_QUENTE,
      })
      .eq("id", id);

    await sendLeadToMetaCapi(request, {
      ...input,
      leadId: id,
      sessionId,
    });

    maybeNotifyDiscordQuizComplete(input, id);

    return { id, checkout_url };
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
      ...metaFields,
      ...(input.quiz_extra ?? {}),
      checkout_completed: true,
      reached_kiwify: true,
      kiwify_checkout_pending: true,
      kiwify_checkout_started_at: now,
      kiwify_checkout_abandoned: false,
    }) as Json,
    last_event_at: now,
    reached_kiwify_at: now,
    status: LEAD_STATUS_QUENTE,
  };

  if (existing) {
    const { data, error } = await supabase
      .from("leads")
      .update(base)
      .eq("id", existing.id)
      .select("id")
      .single();
    if (error) throw error;
    await sendLeadToMetaCapi(request, {
      ...input,
      leadId: data.id,
      sessionId: null,
    });
    maybeNotifyDiscordQuizComplete(input, data.id);
    return { id: data.id, checkout_url };
  }

  const { data, error } = await supabase
    .from("leads")
    .insert({
      ...base,
      source: "landing",
    })
    .select("id")
    .single();

  if (error) throw error;

  await sendLeadToMetaCapi(request, {
    ...input,
    leadId: data.id,
    sessionId: null,
  });

  maybeNotifyDiscordQuizComplete(input, data.id);

  return { id: data.id, checkout_url };
}

function quizDiscordAnswers(extra: Record<string, unknown> | undefined) {
  if (!extra) return undefined;
  return {
    ...(extra.ads_quiz_answers as Record<string, unknown> | undefined),
    lead_age: extra.lead_age,
    lead_income: extra.lead_income,
  };
}

async function notifyDiscordQuizLead(
  kind: "capture" | "complete" | "abandon",
  leadId: string,
  input: {
    full_name: string;
    email: string;
    phone: string;
    age?: number;
    income?: string;
    utm?: Json;
    quizAnswers?: Record<string, unknown>;
    lastStep?: string;
  },
) {
  const utm =
    input.utm && typeof input.utm === "object" && !Array.isArray(input.utm)
      ? (input.utm as Record<string, unknown>)
      : undefined;

  await notifyDiscordLead({
    kind,
    leadId,
    full_name: input.full_name,
    email: input.email,
    phone: input.phone,
    age: input.age,
    income: input.income,
    utm,
    quizAnswers: input.quizAnswers,
    lastStep: input.lastStep,
  });
}

function maybeNotifyDiscordQuizComplete(
  input: {
    full_name: string;
    email: string;
    phone: string;
    utm?: Json;
    quiz_extra?: Record<string, unknown>;
  },
  leadId: string,
) {
  if (!input.quiz_extra?.ads_quiz) return;
  void notifyDiscordQuizLead("complete", leadId, {
    full_name: input.full_name,
    email: input.email,
    phone: input.phone,
    utm: input.utm,
    quizAnswers: quizDiscordAnswers(input.quiz_extra),
  });
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
  await ensureColdLeadForSession(sessionId, { eventName: "checkout_modal_abandon" });

  const now = new Date().toISOString();
  const tracking: CheckoutTracking = {
    cta: input.cta,
    cta_label: ctaLabel(input.cta),
  };

  const partial: Record<string, unknown> = {
    lead_temperature: "frio",
    checkout_abandoned: true,
    abandoned_at: now,
    abandoned_step: input.step,
    modal_seen: true,
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
    .select("id, quiz_answers, status")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (input.email) {
    const email = input.email.trim().toLowerCase();
    const id = await upsertIdentifiedLead(request, sessionId, {
      full_name: (input.first_name?.trim().split(/\s+/)[0] || "Visitante — sem nome").slice(0, 80),
      email,
      phone: input.phone?.replace(/\D/g, "") || undefined,
    });

    const prev = (sessionLead?.quiz_answers ?? {}) as Record<string, unknown>;

    await supabase
      .from("leads")
      .update({
        utm: (input.utm ?? {}) as Json,
        quiz_answers: { ...prev, ...buildQuizAnswers(tracking, partial) } as Json,
        last_event_at: now,
        reached_kiwify_at: null,
        status: LEAD_STATUS_FRIO,
      })
      .eq("id", id);

    return id;
  }

  if (sessionLead) {
    const prev = (sessionLead.quiz_answers ?? {}) as Record<string, unknown>;
    await supabase
      .from("leads")
      .update({
        quiz_answers: { ...prev, ...partial } as Json,
        last_event_at: now,
        status: LEAD_STATUS_FRIO,
      })
      .eq("id", sessionLead.id);
    return sessionLead.id;
  }

  const emailHash = hashIdentifier(`abandon:${sessionId}`, salt);
  const { data, error } = await supabase
    .from("leads")
    .insert({
      full_name: input.first_name?.trim().split(/\s+/)[0] || "Visitante — sem nome",
      email_hash: emailHash,
      source: "landing",
      session_id: sessionId,
      utm: (input.utm ?? {}) as Json,
      quiz_answers: { ...partial, ...tracking } as Json,
      status: LEAD_STATUS_FRIO,
      last_event_at: now,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export async function upsertAdsQuizProgress(
  request: Request,
  input: {
    step_id: string;
    answers: Record<string, unknown>;
    phase?: "steps" | "calculating" | "result";
    utm?: Json;
  },
) {
  const sessionId = getSessionIdFromRequest(request);
  if (!sessionId) return null;

  await upsertLandingSession(request, sessionId);
  await ensureColdLeadForSession(sessionId, { eventName: "quiz_progress" });

  const now = new Date().toISOString();
  const tracking: CheckoutTracking = {
    cta: "quiz_form",
    cta_label: "Quiz anúncios",
  };

  const supabase = createServiceSupabase();
  const { data: sessionLead } = await supabase
    .from("leads")
    .select("id, quiz_answers")
    .eq("session_id", sessionId)
    .maybeSingle();

  const partial: Record<string, unknown> = {
    ads_quiz: true,
    ads_quiz_step: input.step_id,
    ads_quiz_answers: input.answers,
    ads_quiz_updated_at: now,
    ...(input.phase ? { ads_quiz_phase: input.phase } : {}),
  };

  if (sessionLead) {
    const prev = (sessionLead.quiz_answers ?? {}) as Record<string, unknown>;
    await supabase
      .from("leads")
      .update({
        utm: (input.utm ?? {}) as Json,
        quiz_answers: { ...prev, ...buildQuizAnswers(tracking, partial) } as Json,
        last_event_at: now,
      })
      .eq("id", sessionLead.id);
    return sessionLead.id;
  }

  return null;
}

export async function upsertAdsQuizAbandon(
  request: Request,
  input: {
    phase: string;
    step_id?: string;
    answers: Record<string, unknown>;
    utm?: Json;
  },
) {
  const sessionId = getSessionIdFromRequest(request);
  if (!sessionId) return null;

  await upsertLandingSession(request, sessionId);
  await ensureColdLeadForSession(sessionId, { eventName: "quiz_abandon" });

  const supabase = createServiceSupabase();
  const { data: sessionLead } = await supabase
    .from("leads")
    .select("id, full_name, email_enc, phone_enc, quiz_answers, status, reached_kiwify_at")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (!sessionLead?.email_enc) return null;

  const prev = (sessionLead.quiz_answers ?? {}) as Record<string, unknown>;
  if (prev.checkout_completed === true || prev.discord_quiz_abandon_notified_at) {
    return sessionLead.id;
  }
  if (sessionLead.reached_kiwify_at) return sessionLead.id;

  const now = new Date().toISOString();
  const tracking: CheckoutTracking = {
    cta: "quiz_form",
    cta_label: "Quiz anúncios",
  };

  const mergedAnswers = {
    ...((prev.ads_quiz_answers ?? {}) as Record<string, unknown>),
    ...input.answers,
  };

  const partial: Record<string, unknown> = {
    ads_quiz: true,
    ads_quiz_abandoned: true,
    ads_quiz_abandoned_at: now,
    ads_quiz_abandoned_phase: input.phase,
    ads_quiz_abandoned_step: input.step_id ?? null,
    ads_quiz_answers: mergedAnswers,
    ads_quiz_updated_at: now,
    discord_quiz_abandon_notified_at: now,
  };

  await supabase
    .from("leads")
    .update({
      utm: (input.utm ?? {}) as Json,
      quiz_answers: { ...prev, ...buildQuizAnswers(tracking, partial) } as Json,
      last_event_at: now,
    })
    .eq("id", sessionLead.id);

  const age = prev.lead_age;
  const income = prev.lead_income;

  void notifyDiscordQuizLead("abandon", sessionLead.id, {
    full_name: sessionLead.full_name,
    email: sessionLead.email_enc,
    phone: sessionLead.phone_enc ?? "",
    age: typeof age === "number" ? age : undefined,
    income: typeof income === "string" ? income : undefined,
    utm: input.utm,
    lastStep: input.step_id ?? input.phase,
    quizAnswers: quizDiscordAnswers({
      ads_quiz_answers: mergedAnswers,
      lead_age: age,
      lead_income: income,
    }),
  });

  return sessionLead.id;
}

export async function upsertAdsQuizLeadCapture(
  request: Request,
  input: {
    full_name: string;
    email: string;
    phone: string;
    age: number;
    income: string;
    utm?: Json;
    meta?: CheckoutMeta;
  },
) {
  const sessionId = getSessionIdFromRequest(request);
  if (!sessionId) return null;

  await upsertLandingSession(request, sessionId);

  const phone = input.phone.replace(/\D/g, "");
  const email = input.email.trim().toLowerCase();
  const full_name = input.full_name.trim();

  const id = await upsertIdentifiedLead(request, sessionId, {
    full_name,
    email,
    phone,
  });

  const now = new Date().toISOString();
  const tracking: CheckoutTracking = {
    cta: "quiz_form",
    cta_label: "Quiz anúncios",
  };
  const metaFields = metaQuizFields(input.meta);

  const supabase = createServiceSupabase();
  const { data: lead } = await supabase
    .from("leads")
    .select("quiz_answers")
    .eq("id", id)
    .single();

  const prev = (lead?.quiz_answers ?? {}) as Record<string, unknown>;

  await supabase
    .from("leads")
    .update({
      utm: (input.utm ?? {}) as Json,
      quiz_answers: buildQuizAnswers(tracking, {
        ...prev,
        ...metaFields,
        ads_quiz: true,
        lead_age: input.age,
        lead_income: input.income,
        lead_captured_at: now,
        ads_quiz_phase: "steps",
      }) as Json,
      last_event_at: now,
      status: LEAD_STATUS_QUENTE,
    })
    .eq("id", id);

  await sendLeadToMetaCapi(request, {
    full_name,
    email,
    phone,
    utm: input.utm,
    tracking,
    meta: input.meta,
    leadId: id,
    sessionId,
  });

  void notifyDiscordQuizLead("capture", id, {
    full_name,
    email,
    phone,
    age: input.age,
    income: input.income,
    utm: input.utm,
  });

  return id;
}
