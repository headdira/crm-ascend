import {
  DEFAULT_ADS_QUIZ_CONFIG,
  resolveChoiceLabel,
  type AdsQuizStep,
} from "@crm-ascend/validation/ads-quiz";

export type DiscordLeadKind = "capture" | "complete";

export type DiscordLeadPayload = {
  kind: DiscordLeadKind;
  leadId: string;
  full_name: string;
  email: string;
  phone: string;
  age?: number;
  income?: string;
  utm?: Record<string, unknown>;
  quizAnswers?: Record<string, unknown>;
};

const INCOME_LABELS: Record<string, string> = {
  ate_2000: "Até R$ 2.000",
  "2000_5000": "R$ 2.000 a R$ 5.000",
  "5000_10000": "R$ 5.000 a R$ 10.000",
  acima_10000: "Acima de R$ 10.000",
};

function getDiscordWebhookUrl(): string | undefined {
  return (
    import.meta.env.DISCORD_LEAD_WEBHOOK_URL ??
    (typeof process !== "undefined" ? process.env.DISCORD_LEAD_WEBHOOK_URL : undefined)
  );
}

function stepTitle(step: AdsQuizStep): string {
  if (step.type === "choice" || step.type === "multichoice") {
    const t = step.title.trim();
    if (t.length <= 60) return t;
    return step.id.replace(/_/g, " ");
  }
  return step.id;
}

function formatQuizAnswerLines(answers: Record<string, unknown> | undefined): string {
  if (!answers) return "—";

  const raw = (answers.ads_quiz_answers ?? answers) as Record<string, string>;
  const lines: string[] = [];
  const steps = DEFAULT_ADS_QUIZ_CONFIG.steps;

  for (const step of steps) {
    if (step.type !== "choice" && step.type !== "multichoice") continue;
    const value = resolveChoiceLabel(steps, raw, step.id, true);
    if (value) lines.push(`**${stepTitle(step)}:** ${value}`);
  }

  const age = answers.lead_age ?? raw.lead_age;
  if (age) lines.unshift(`**Idade:** ${age}`);

  const incomeKey = String(answers.lead_income ?? raw.lead_income ?? "");
  if (incomeKey) {
    lines.unshift(`**Renda:** ${INCOME_LABELS[incomeKey] ?? incomeKey}`);
  }

  const tags = answers.profile_tags;
  if (typeof tags === "string" && tags) {
    lines.push(`**Tags:** ${tags}`);
  }

  return lines.length > 0 ? lines.join("\n").slice(0, 1024) : "Ainda respondendo o quiz…";
}

function utmLine(utm: Record<string, unknown> | undefined): string | null {
  if (!utm) return null;
  const parts = ["utm_source", "utm_medium", "utm_campaign", "utm_content"]
    .map((k) => {
      const v = utm[k];
      return typeof v === "string" && v ? `${k}=${v}` : null;
    })
    .filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : null;
}

export async function notifyDiscordLead(payload: DiscordLeadPayload): Promise<void> {
  const webhookUrl = getDiscordWebhookUrl();
  if (!webhookUrl) return;

  const isComplete = payload.kind === "complete";
  const title = isComplete ? "Lead completou o quiz" : "Novo lead no quiz";
  const color = isComplete ? 0x00a650 : 0xf2a218;

  const fields: { name: string; value: string; inline?: boolean }[] = [
    { name: "Nome", value: payload.full_name.slice(0, 256), inline: true },
    { name: "E-mail", value: payload.email.slice(0, 256), inline: true },
    { name: "WhatsApp", value: payload.phone.slice(0, 64), inline: true },
  ];

  if (payload.age) {
    fields.push({ name: "Idade", value: String(payload.age), inline: true });
  }
  if (payload.income) {
    fields.push({
      name: "Renda",
      value: INCOME_LABELS[payload.income] ?? payload.income,
      inline: true,
    });
  }

  const campaign = utmLine(payload.utm);
  if (campaign) {
    fields.push({ name: "Campanha", value: campaign.slice(0, 1024) });
  }

  if (isComplete) {
    fields.push({
      name: "Respostas do quiz",
      value: formatQuizAnswerLines(payload.quizAnswers),
    });
  }

  fields.push({
    name: "ID",
    value: `\`${payload.leadId}\``,
    inline: true,
  });

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Ascend Leads",
        embeds: [
          {
            title,
            color,
            fields,
            timestamp: new Date().toISOString(),
            footer: { text: "crm-ascend · quiz /form" },
          },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[discord-lead] webhook failed:", res.status, body.slice(0, 200));
    }
  } catch (err) {
    console.error("[discord-lead] webhook error:", err);
  }
}
