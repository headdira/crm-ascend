import type { AdsQuizConfig, AdsQuizStep } from "@crm-ascend/validation/ads-quiz";
import { getSessionIdFromRequest } from "@/lib/sales/tracking-server";
import { createServiceSupabase } from "@crm-ascend/db";
import { loadAdsQuizConfig } from "@/lib/sales/ads-quiz-config-server";

const ANSWER_META_KEYS = new Set(["profile_tags", "insights_seen", "lead_age", "lead_income"]);

export type QuizResumePhase = "steps" | "result";

export type QuizResumePayload = {
  resumable: true;
  phase: QuizResumePhase;
  step_index: number;
  answers: Record<string, string>;
  contact: {
    full_name: string;
    email: string;
    phone: string;
    age?: number;
    income?: string;
  };
};

export type QuizResumeResponse = { resumable: false } | QuizResumePayload;

function extractQuizAnswers(raw: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (ANSWER_META_KEYS.has(key)) continue;
    if (typeof value === "string") out[key] = value;
  }
  return out;
}

function questionSteps(config: AdsQuizConfig): AdsQuizStep[] {
  return config.steps.filter((s) => s.type !== "offer");
}

function resolveResumePosition(
  config: AdsQuizConfig,
  quiz: Record<string, unknown>,
): { phase: QuizResumePhase; step_index: number } {
  const steps = questionSteps(config);
  const storedPhase = String(quiz.ads_quiz_phase ?? "");
  const abandonedPhase = String(quiz.ads_quiz_abandoned_phase ?? "");
  const stepId = String(quiz.ads_quiz_step ?? quiz.ads_quiz_abandoned_step ?? "");

  if (quiz.checkout_completed === true) {
    return { phase: "result", step_index: 0 };
  }

  if (
    storedPhase === "result" ||
    storedPhase === "calculating" ||
    abandonedPhase === "result" ||
    abandonedPhase === "calculating"
  ) {
    return { phase: "result", step_index: 0 };
  }

  let stepIndex = 0;

  if (stepId && stepId !== "checkpoint" && stepId !== "post_questions" && stepId !== "oferta") {
    const idx = steps.findIndex((s) => s.id === stepId);
    if (idx >= 0) stepIndex = idx + 1;
  } else if (stepId === "oferta" || stepId === "post_questions") {
    return { phase: "result", step_index: 0 };
  }

  if (stepIndex >= steps.length) {
    return { phase: "result", step_index: 0 };
  }

  return { phase: "steps", step_index: Math.min(stepIndex, Math.max(steps.length - 1, 0)) };
}

export async function loadQuizResume(request: Request): Promise<QuizResumeResponse> {
  const sessionId = getSessionIdFromRequest(request);
  if (!sessionId) return { resumable: false };

  const config = await loadAdsQuizConfig();
  if (!config) return { resumable: false };

  const supabase = createServiceSupabase();
  const { data: lead } = await supabase
    .from("leads")
    .select("full_name, email_enc, phone_enc, quiz_answers, reached_kiwify_at")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (!lead?.email_enc) return { resumable: false };

  const quiz = (lead.quiz_answers ?? {}) as Record<string, unknown>;
  if (!quiz.lead_captured_at && !quiz.ads_quiz) return { resumable: false };

  const { phase, step_index } = resolveResumePosition(config, quiz);
  const answers = extractQuizAnswers((quiz.ads_quiz_answers ?? {}) as Record<string, unknown>);

  const age = quiz.lead_age;
  const income = quiz.lead_income;

  return {
    resumable: true,
    phase,
    step_index,
    answers,
    contact: {
      full_name: lead.full_name,
      email: lead.email_enc,
      phone: lead.phone_enc ?? "",
      ...(typeof age === "number" ? { age } : {}),
      ...(typeof income === "string" ? { income } : {}),
    },
  };
}
