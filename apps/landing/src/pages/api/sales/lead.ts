import type { APIRoute } from "astro";
import { z } from "zod";
import type { Json } from "@crm-ascend/db";
import { ctaLabel } from "@/lib/sales/cta-labels";
import {
  upsertAdsQuizAbandon,
  upsertAdsQuizLeadCapture,
  upsertAdsQuizProgress,
  upsertCheckoutAbandon,
  upsertCheckoutLead,
} from "@/lib/sales/lead-server";

const metaSchema = z.object({
  event_id: z.string().uuid(),
  fbp: z.string().max(256).optional(),
  fbc: z.string().max(256).optional(),
});

const completeSchema = z.object({
  type: z.literal("complete"),
  full_name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  marketing_consent: z.literal(true),
  utm: z.record(z.unknown()).optional(),
  cta: z.string().max(64).optional(),
  meta: metaSchema.optional(),
});

const abandonSchema = z.object({
  type: z.literal("abandon"),
  step: z.enum(["name", "email", "phone"]),
  cta: z.string().max(64).optional(),
  first_name: z.string().max(80).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional(),
  utm: z.record(z.unknown()).optional(),
});

const quizCompleteSchema = completeSchema.omit({ type: true }).extend({
  type: z.literal("quiz_complete"),
  answers: z.record(z.unknown()).optional(),
});

const quizProgressSchema = z.object({
  type: z.literal("quiz_progress"),
  step_id: z.string().min(1).max(64),
  phase: z.enum(["steps", "calculating", "result"]).optional(),
  answers: z.record(z.unknown()).optional(),
  utm: z.record(z.unknown()).optional(),
});

const quizLeadCaptureSchema = z.object({
  type: z.literal("quiz_lead_capture"),
  full_name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  age: z.number().int().min(16).max(99),
  income: z.string().min(1).max(40),
  utm: z.record(z.unknown()).optional(),
  meta: metaSchema.optional(),
});

const quizAbandonSchema = z.object({
  type: z.literal("quiz_abandon"),
  phase: z.enum(["steps", "calculating", "result"]),
  step_id: z.string().max(64).optional(),
  answers: z.record(z.unknown()).optional(),
  utm: z.record(z.unknown()).optional(),
});

const leadSchema = z.discriminatedUnion("type", [
  completeSchema,
  abandonSchema,
  quizCompleteSchema,
  quizProgressSchema,
  quizLeadCaptureSchema,
  quizAbandonSchema,
]);

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    if (parsed.data.type === "quiz_complete") {
      const result = await upsertCheckoutLead(request, {
        full_name: parsed.data.full_name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        utm: (parsed.data.utm ?? {}) as Json,
        tracking: {
          cta: "quiz_form",
          cta_label: "Quiz anúncios",
        },
        meta: parsed.data.meta,
        quiz_extra: {
          ads_quiz: true,
          ads_quiz_answers: parsed.data.answers ?? {},
          checkout_flow: false,
        },
      });
      return new Response(JSON.stringify({ ok: true, id: result.id, checkout_url: result.checkout_url }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (parsed.data.type === "complete") {
      const result = await upsertCheckoutLead(request, {
        full_name: parsed.data.full_name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        utm: (parsed.data.utm ?? {}) as Json,
        tracking: {
          cta: parsed.data.cta,
          cta_label: ctaLabel(parsed.data.cta),
        },
        meta: parsed.data.meta,
      });
      return new Response(JSON.stringify({ ok: true, id: result.id, checkout_url: result.checkout_url }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (parsed.data.type === "quiz_progress") {
      const id = await upsertAdsQuizProgress(request, {
        step_id: parsed.data.step_id,
        phase: parsed.data.phase,
        answers: parsed.data.answers ?? {},
        utm: (parsed.data.utm ?? {}) as Json,
      });
      return new Response(JSON.stringify({ ok: true, id }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (parsed.data.type === "quiz_lead_capture") {
      const id = await upsertAdsQuizLeadCapture(request, {
        full_name: parsed.data.full_name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        age: parsed.data.age,
        income: parsed.data.income,
        utm: (parsed.data.utm ?? {}) as Json,
        meta: parsed.data.meta,
      });
      return new Response(JSON.stringify({ ok: true, id }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (parsed.data.type === "quiz_abandon") {
      const id = await upsertAdsQuizAbandon(request, {
        phase: parsed.data.phase,
        step_id: parsed.data.step_id,
        answers: parsed.data.answers ?? {},
        utm: (parsed.data.utm ?? {}) as Json,
      });
      return new Response(JSON.stringify({ ok: true, id }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const id = await upsertCheckoutAbandon(request, {
      step: parsed.data.step,
      cta: parsed.data.cta,
      first_name: parsed.data.first_name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      utm: (parsed.data.utm ?? {}) as Json,
    });

    return new Response(JSON.stringify({ ok: true, id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Could not save lead" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
