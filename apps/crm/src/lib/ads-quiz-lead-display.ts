import {
  DEFAULT_ADS_QUIZ_CONFIG,
  resolveChoiceLabel,
  type AdsQuizStep,
} from "@crm-ascend/validation/ads-quiz";

export const ADS_QUIZ_INCOME_LABELS: Record<string, string> = {
  ate_2000: "Até R$ 2.000",
  "2000_5000": "R$ 2.000 a R$ 5.000",
  "5000_10000": "R$ 5.000 a R$ 10.000",
  acima_10000: "Acima de R$ 10.000",
};

function stepTitle(step: AdsQuizStep): string {
  if (step.type === "choice" || step.type === "multichoice") return step.title;
  return step.id;
}

export type AdsQuizAnswerRow = { label: string; value: string };

export function isAdsQuizLead(quiz: Record<string, unknown>): boolean {
  return quiz.ads_quiz === true;
}

export function getQuizStepAnswer(
  quiz: Record<string, unknown>,
  stepId: string,
  forDynamic = true,
): string {
  const raw = (quiz.ads_quiz_answers ?? {}) as Record<string, string>;
  const steps = DEFAULT_ADS_QUIZ_CONFIG.steps;
  return resolveChoiceLabel(steps, raw, stepId, forDynamic);
}

export function getQuizIncomeLabel(quiz: Record<string, unknown>): string | null {
  const incomeKey = String(quiz.lead_income ?? "");
  if (!incomeKey) return null;
  return ADS_QUIZ_INCOME_LABELS[incomeKey] ?? incomeKey;
}

export function formatAdsQuizLeadRows(quiz: Record<string, unknown>): AdsQuizAnswerRow[] {
  const rows: AdsQuizAnswerRow[] = [];
  const raw = (quiz.ads_quiz_answers ?? {}) as Record<string, string>;
  const steps = DEFAULT_ADS_QUIZ_CONFIG.steps;

  const age = quiz.lead_age ?? raw.lead_age;
  if (age != null && String(age).trim()) {
    rows.push({ label: "Idade", value: String(age) });
  }

  const incomeKey = String(quiz.lead_income ?? raw.lead_income ?? "");
  if (incomeKey) {
    rows.push({
      label: "Renda mensal",
      value: ADS_QUIZ_INCOME_LABELS[incomeKey] ?? incomeKey,
    });
  }

  for (const step of steps) {
    if (step.type !== "choice" && step.type !== "multichoice") continue;
    const value = resolveChoiceLabel(steps, raw, step.id, true);
    if (value) rows.push({ label: stepTitle(step), value });
  }

  const tags = raw.profile_tags ?? (quiz.profile_tags as string | undefined);
  if (typeof tags === "string" && tags.trim()) {
    rows.push({ label: "Tags de perfil", value: tags });
  }

  if (typeof quiz.ads_quiz_step === "string") {
    rows.push({ label: "Última etapa salva", value: quiz.ads_quiz_step });
  }

  if (typeof quiz.ads_quiz_updated_at === "string") {
    rows.push({ label: "Quiz atualizado em", value: quiz.ads_quiz_updated_at });
  }

  return rows;
}
