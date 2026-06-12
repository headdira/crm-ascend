import { z } from "zod";

export const ADS_QUIZ_SLUG = "ascend-ads" as const;

export const quizInsightVariantSchema = z.enum([
  "default",
  "print",
  "testimonial",
  "objection",
  "benefit",
  "stat",
  "mentor",
]);

export const QUIZ_PROOF_IMAGES = [
  "/media/quiz-evidence/proof/notificacoes/notif-116.jpeg",
  "/media/quiz-evidence/proof/notificacoes/notif-104.jpeg",
  "/media/quiz-evidence/proof/notificacoes/notif-03.jpeg",
  "/media/quiz-evidence/proof/notificacoes/notif-111.jpeg",
  "/media/quiz-evidence/proof/notificacoes/notif-108.jpeg",
  "/media/quiz-evidence/proof/notificacoes/notif-08.jpeg",
  "/media/quiz-evidence/proof/notificacoes/notif-112.jpeg",
  "/media/quiz-evidence/proof/notificacoes/notif-119.jpeg",
  "/media/quiz-evidence/proof/notificacoes/notif-121.jpeg",
  "/media/quiz-evidence/proof/notificacoes/notif-125.jpeg",
] as const;

/** Única galeria de prints no fluxo linear do funil (2 fat + 2 notif). */
export const QUIZ_FLOW_PROOF_GALLERY = [
  "/media/quiz-evidence/proof/faturamento/fat-01.jpeg",
  "/media/quiz-evidence/proof/faturamento/fat-10.jpeg",
  "/media/quiz-evidence/proof/notificacoes/notif-116.jpeg",
  "/media/quiz-evidence/proof/notificacoes/notif-104.jpeg",
] as const;

export const quizInsightProofSchema = z.object({
  name: z.string().max(80).optional(),
  role: z.string().max(120).optional(),
  quote: z.string().max(400).optional(),
  imageUrl: z.string().max(500).optional(),
  imageCaption: z.string().max(120).optional(),
  statLabel: z.string().max(80).optional(),
});

export const quizOptionInsightSchema = z.object({
  eyebrow: z.string().max(80).optional(),
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(800),
  ctaLabel: z.string().max(80).optional(),
  variant: quizInsightVariantSchema.optional(),
  proof: quizInsightProofSchema.optional(),
});

const quizOptionSchema = z.object({
  id: z.string().min(1).max(40),
  label: z.string().min(1).max(200),
  /** Versão mais fluida para o resumo dinâmico (pergunta 12). */
  dynamicLabel: z.string().max(200).optional(),
  subtitle: z.string().max(300).optional(),
  tags: z.array(z.string().min(1).max(40)).max(8).optional(),
  insight: quizOptionInsightSchema.optional(),
});

const tagRuleSchema = z.object({
  whenTags: z.array(z.string().min(1).max(40)).min(1).max(6),
});

const mechanismStepItemSchema = z.object({
  title: z.string().min(1).max(200),
  subtitle: z.string().max(300).optional(),
  highlight: z.string().max(120).optional(),
});

const quizStepSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.string().min(1).max(40),
    type: z.literal("choice"),
    title: z.string().min(1).max(300),
    hint: z.string().max(400).optional(),
    options: z.array(quizOptionSchema).min(2).max(6),
  }),
  z.object({
    id: z.string().min(1).max(40),
    type: z.literal("message"),
    title: z.string().min(1).max(300),
    body: z.string().min(1).max(2000),
    ctaLabel: z.string().min(1).max(80).default("Continuar"),
    imageUrl: z.string().max(500).optional(),
    variant: z.enum(["default", "story", "authority"]).optional(),
  }),
  z.object({
    id: z.string().min(1).max(40),
    type: z.literal("dynamic"),
    title: z.string().min(1).max(300),
    body: z.string().min(1).max(2000),
    ctaLabel: z.string().min(1).max(80).default("Continuar"),
    imageUrl: z.string().max(500).optional(),
  }),
  z.object({
    id: z.string().min(1).max(40),
    type: z.literal("mechanism"),
    title: z.string().min(1).max(300),
    intro: z.string().max(800).optional(),
    mechanismSteps: z.array(mechanismStepItemSchema).min(2).max(4),
    bullets: z.array(z.string().min(1).max(200)).max(8).optional(),
    ctaLabel: z.string().min(1).max(80).default("Continuar"),
  }),
  z.object({
    id: z.string().min(1).max(40),
    type: z.literal("required_video"),
    title: z.string().min(1).max(300),
    intro: z.string().max(400).optional(),
    videoUrl: z.string().max(500),
    posterUrl: z.string().max(500).optional(),
    ctaLabel: z.string().min(1).max(80).default("Continuar"),
  }),
  z.object({
    id: z.string().min(1).max(40),
    type: z.literal("testimonial"),
    title: z.string().min(1).max(300),
    intro: z.string().max(400).optional(),
    name: z.string().min(1).max(80),
    role: z.string().max(120).optional(),
    quote: z.string().max(400).optional(),
    videoUrl: z.string().max(500),
    ctaLabel: z.string().min(1).max(80).default("Continuar"),
  }),
  z.object({
    id: z.string().min(1).max(40),
    type: z.literal("proof_gallery"),
    title: z.string().min(1).max(300),
    intro: z.string().max(400).optional(),
    imageUrls: z.array(z.string().max(500)).min(1).max(6),
    ctaLabel: z.string().min(1).max(80).default("Continuar"),
  }),
  z.object({
    id: z.string().min(1).max(40),
    type: z.literal("store_showcase"),
    title: z.string().min(1).max(300),
    intro: z.string().max(400).optional(),
    stores: z
      .array(
        z.object({
          name: z.string().min(1).max(80),
          niche: z.string().max(120).optional(),
          imageUrl: z.string().max(500).optional(),
          storeUrl: z.string().min(1).max(500),
        }),
      )
      .min(1)
      .max(8),
    ctaLabel: z.string().min(1).max(80).default("Continuar"),
  }),
  z.object({
    id: z.string().min(1).max(40),
    type: z.literal("multichoice"),
    title: z.string().min(1).max(300),
    hint: z.string().max(400).optional(),
    minSelect: z.number().int().min(1).max(8).default(1),
    maxSelect: z.number().int().min(1).max(8).optional(),
    ctaLabel: z.string().min(1).max(80).default("Continuar"),
    options: z.array(quizOptionSchema).min(2).max(8),
  }),
  z.object({
    id: z.string().min(1).max(40),
    type: z.literal("offer"),
    title: z.string().min(1).max(300),
    body: z.string().min(1).max(1500),
    priceLabel: z.string().min(1).max(80),
    originalPriceLabel: z.string().max(80).optional(),
    urgencyNote: z.string().max(300).optional(),
    priceNote: z.string().max(200).optional(),
    bullets: z.array(z.string().min(1).max(200)).min(1).max(8),
    ctaLabel: z.string().min(1).max(80).default("Quero entrar no Ascend Club"),
  }),
]);

export const adsQuizConfigSchema = z.object({
  version: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal(6),
    z.literal(7),
    z.literal(8),
    z.literal(9),
    z.literal(10),
    z.literal(11),
    z.literal(12),
    z.literal(13),
    z.literal(14),
    z.literal(15),
    z.literal(16),
    z.literal(17),
    z.literal(18),
    z.literal(19),
    z.literal(20),
  ]),
  landing: z.object({
    eyebrow: z.string().max(120),
    headline: z.string().min(1).max(400),
    subheadline: z.string().max(600),
    ctaLabel: z.string().min(1).max(80),
    socialProof: z.string().max(200).optional(),
    heroImageUrl: z.string().max(500).optional(),
  }),
  steps: z.array(quizStepSchema).min(1).max(24),
  calculating: z
    .object({
      messages: z.array(z.string().min(1).max(120)).min(1).max(6),
      messagesByTags: z
        .array(
          tagRuleSchema.extend({
            messages: z.array(z.string().min(1).max(120)).min(1).max(6),
          }),
        )
        .max(8)
        .optional(),
    })
    .optional(),
  result: z
    .object({
      eyebrow: z.string().min(1).max(120),
      headline: z.string().min(1).max(400),
      reassurance: z.string().max(600).optional(),
      badge: z.string().max(80).optional(),
      highlights: z.array(z.string().min(1).max(200)).max(6).optional(),
    })
    .optional(),
  resultRules: z
    .array(
      tagRuleSchema.extend({
        headline: z.string().min(1).max(400),
        reassurance: z.string().max(600).optional(),
        badge: z.string().max(80).optional(),
        highlights: z.array(z.string().min(1).max(200)).max(6).optional(),
      }),
    )
    .max(12)
    .optional(),
  testimonials: z
    .array(
      z.object({
        name: z.string().min(1).max(80),
        role: z.string().max(120).optional(),
        quote: z.string().min(1).max(400),
        videoUrl: z.string().max(500).optional(),
      }),
    )
    .max(10)
    .optional(),
  contact: z.object({
    nameTitle: z.string().min(1).max(120),
    nameHint: z.string().max(300).optional(),
    ageTitle: z.string().min(1).max(120),
    ageHint: z.string().max(300).optional(),
    incomeTitle: z.string().min(1).max(120),
    incomeHint: z.string().max(300).optional(),
    emailTitle: z.string().min(1).max(120),
    emailHint: z.string().max(300).optional(),
    phoneTitle: z.string().min(1).max(120),
    phoneHint: z.string().max(300).optional(),
    submitLabel: z.string().min(1).max(80),
  }),
});

export type AdsQuizConfig = z.infer<typeof adsQuizConfigSchema>;

/** Converte paths legados `/media/proof/proof-03.jpeg` → CDN. */
export function resolveQuizProofImageUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const match = url.match(/proof-(\d{1,2})/i);
  if (match) {
    const idx = Number.parseInt(match[1], 10) - 1;
    if (idx >= 0 && idx < QUIZ_PROOF_IMAGES.length) return QUIZ_PROOF_IMAGES[idx];
  }
  return url;
}

function normalizeInsightProof(
  proof: z.infer<typeof quizInsightProofSchema> | undefined,
): z.infer<typeof quizInsightProofSchema> | undefined {
  if (!proof) return proof;
  const imageUrl = resolveQuizProofImageUrl(proof.imageUrl);
  return imageUrl === proof.imageUrl ? proof : { ...proof, imageUrl };
}

/** Versão do copy — configs com version menor recebem DEFAULT completo ao carregar. */
const CURRENT_ADS_QUIZ_COPY_VERSION = 20;

const STALE_LANDING_MARKERS = [
  "monta seu plano",
  "Veja se o Ascend Club",
  "resolve o que você busca",
  "próximo passo para construir",
  "sócio de uma loja",
  "Descubra como ser",
  "Ascend Club",
  "PIX semanais",
  "Responda o quiz e veja se o modelo encaixa",
  "R$ 2.554",
  "liberdade financeira",
  "Conquistar liberdade",
];

function shouldRefreshLandingCopy(landing: AdsQuizConfig["landing"]): boolean {
  const text = `${landing.headline} ${landing.subheadline}`;
  return STALE_LANDING_MARKERS.some((marker) => text.includes(marker));
}

/** Corrige URLs de print quebradas e copy desatualizado em configs salvas no Supabase. */
export function normalizeAdsQuizConfig(config: AdsQuizConfig): AdsQuizConfig {
  if ((config.version ?? 1) < CURRENT_ADS_QUIZ_COPY_VERSION) {
    return normalizeAdsQuizConfig({
      ...DEFAULT_ADS_QUIZ_CONFIG,
      version: CURRENT_ADS_QUIZ_COPY_VERSION,
    });
  }

  const landing = shouldRefreshLandingCopy(config.landing)
    ? { ...config.landing, ...DEFAULT_ADS_QUIZ_CONFIG.landing }
    : config.landing;

  return {
    ...config,
    landing,
    contact: { ...DEFAULT_ADS_QUIZ_CONFIG.contact, ...config.contact },
    testimonials:
      config.testimonials && config.testimonials.length > 0
        ? config.testimonials
        : DEFAULT_ADS_QUIZ_CONFIG.testimonials,
    steps: config.steps.map((step) => {
      if (step.type === "choice" || step.type === "multichoice") {
        return {
          ...step,
          options: step.options.map((opt) =>
            opt.insight
              ? { ...opt, insight: { ...opt.insight, proof: normalizeInsightProof(opt.insight.proof) } }
              : opt,
          ),
        };
      }
      if ("imageUrl" in step && step.imageUrl) {
        return { ...step, imageUrl: resolveQuizProofImageUrl(step.imageUrl) };
      }
      return step;
    }),
  };
}
export type AdsQuizStep = AdsQuizConfig["steps"][number];
export type QuizOptionInsight = z.infer<typeof quizOptionInsightSchema>;

function addOptionTags(tags: Set<string>, step: AdsQuizStep, optionId: string) {
  if (step.type !== "choice" && step.type !== "multichoice") return;
  const opt = step.options.find((o) => o.id === optionId);
  opt?.tags?.forEach((t) => tags.add(t));
}

export function collectProfileTags(
  questionSteps: AdsQuizStep[],
  answers: Record<string, string>,
): string[] {
  const tags = new Set<string>();
  for (const step of questionSteps) {
    const raw = answers[step.id];
    if (!raw) continue;
    if (step.type === "choice") {
      addOptionTags(tags, step, raw);
      continue;
    }
    if (step.type === "multichoice") {
      raw.split(",").filter(Boolean).forEach((id) => addOptionTags(tags, step, id));
    }
  }
  return [...tags];
}

function optionDisplayLabel(
  option: { label: string; dynamicLabel?: string } | undefined,
  forDynamic: boolean,
): string {
  if (!option) return "";
  if (forDynamic && option.dynamicLabel?.trim()) return option.dynamicLabel.trim();
  return option.label;
}

export function resolveChoiceLabel(
  steps: AdsQuizStep[],
  answers: Record<string, string>,
  stepId: string,
  forDynamic = false,
): string {
  const step = steps.find((s) => s.id === stepId);
  if (!step || (step.type !== "choice" && step.type !== "multichoice")) return "";
  const raw = answers[stepId];
  if (!raw) return "";
  if (step.type === "multichoice") {
    return raw
      .split(",")
      .filter(Boolean)
      .map((id) => optionDisplayLabel(step.options.find((o) => o.id === id), forDynamic))
      .filter(Boolean)
      .join(", ");
  }
  return optionDisplayLabel(step.options.find((o) => o.id === raw), forDynamic);
}

export function resolveDynamicBody(
  body: string,
  answers: Record<string, string>,
  steps: AdsQuizStep[],
): string {
  return body.replace(/\{\{(\w+)\}\}/g, (_, stepId: string) =>
    resolveChoiceLabel(steps, answers, stepId, true),
  );
}

export function matchTagRule<T extends { whenTags: string[] }>(
  rules: T[] | undefined,
  profileTags: string[],
): T | undefined {
  if (!rules?.length) return undefined;
  const tagSet = new Set(profileTags);
  return rules.find((rule) => rule.whenTags.every((t) => tagSet.has(t)));
}

export function resolveCalculatingMessages(
  calculating: AdsQuizConfig["calculating"],
  profileTags: string[],
  fallback: string[],
): string[] {
  const match = matchTagRule(calculating?.messagesByTags, profileTags);
  return match?.messages ?? calculating?.messages ?? fallback;
}

export function resolveResultDisplay(
  config: Pick<AdsQuizConfig, "result" | "resultRules">,
  profileTags: string[],
  fallback: NonNullable<AdsQuizConfig["result"]>,
): NonNullable<AdsQuizConfig["result"]> {
  const base = config.result ?? fallback;
  const rule = matchTagRule(config.resultRules, profileTags);
  if (!rule) return base;
  return {
    eyebrow: base.eyebrow,
    headline: rule.headline,
    reassurance: rule.reassurance ?? base.reassurance,
    badge: rule.badge ?? base.badge,
    highlights: rule.highlights ?? base.highlights,
  };
}

export const DEFAULT_ADS_QUIZ_CONFIG: AdsQuizConfig = {
  version: 20,
  landing: {
    eyebrow: "",
    headline:
      "Você **não monta loja** nem fica caçando produto. Você pode receber até [[R$ 3.319/semana]] no **PIX**, com tudo pronto no nicho que você escolher.",
    subheadline:
      "Responde umas perguntas e vê se encaixa no seu bolso: entregamos **loja já montada**, produto que já vende e a galera te ajudando ao vivo a vender — mesmo começando do absoluto zero.",
    ctaLabel: "QUERO VER SE É PRA MIM",
    socialProof: "Mais de 3 mil alunos já estão lucrando com a metodologia",
  },
  steps: [
    {
      id: "objetivo",
      type: "choice",
      title: "O que mais tira seu sono hoje?",
      hint: "Sem enrolação — isso muda o plano que a gente monta pra você.",
      options: [
        {
          id: "renda_extra",
          label: "Fazer uma grana extra no fim do mês",
          dynamicLabel: "ganhar uma renda extra no fim do mês",
          subtitle: "Pra sobrar depois das contas",
          tags: ["goal_income"],
          insight: {
            eyebrow: "PRA VOCÊ",
            title: "Renda extra sem inventar moda sozinho",
            body: "A loja já vem montada, com produto escolhido no nicho que você curte. Você aprende a divulgar e vender — e quando travar, tem call ao vivo 2x por semana pra te puxar.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[0],
              imageCaption: "Print real — grana entrando no PIX",
            },
          },
        },
        {
          id: "liberdade_fin",
          label: "Parar de depender só do salário",
          dynamicLabel: "parar de depender só do salário",
          subtitle: "Ter uma segunda entrada de dinheiro",
          tags: ["goal_freedom", "goal_income"],
          insight: {
            eyebrow: "PRA VOCÊ",
            title: "Uma loja que coloca dinheiro no bolso de verdade",
            body: "Produto que vende, loja montada no seu nicho e grana entrando no PIX enquanto você aprende a divulgar. Travou? Tem call ao vivo 2x por semana — você não fica sozinho.",
            variant: "print",
          },
        },
        {
          id: "liberdade_geo",
          label: "Trabalhar de casa ou de onde der",
          dynamicLabel: "trabalhar de casa ou de onde der",
          subtitle: "Sem ficar preso no escritório ou na fábrica",
          tags: ["want_flexibility", "want_geo"],
          insight: {
            eyebrow: "PRA VOCÊ",
            title: "Loja online que roda de qualquer canto",
            body: "Vende de casa, da praia ou do intervalo do trampo. Loja pronta, produto no nicho que você escolheu — e quando emperrar na divulgação, tem call ao vivo 2x por semana.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[2],
            },
          },
        },
        {
          id: "transicao",
          label: "Sair do CLT com algo montado na mão",
          dynamicLabel: "sair do CLT com algo montado na mão",
          subtitle: "Virada com estrutura, não no escuro",
          tags: ["goal_transition"],
          insight: {
            eyebrow: "PRA VOCÊ",
            title: "Transição com loja pronta + gente te orientando",
            body: "Enquanto ainda tem salário caindo, você monta a loja com produto validado e aprende a vender com suporte ao vivo. Tem gente na mesma situação que você no grupo.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[3],
              imageCaption: "Print real — quem saiu do CLT",
            },
          },
        },
      ],
    },
    {
      id: "momento",
      type: "choice",
      title: "Qual frase mais parece com a sua vida hoje?",
      hint: "Pra gente encaixar loja, produto e mentoria no que você vive agora.",
      options: [
        {
          id: "esforco_pouco",
          label: "Me mato de trabalhar e o salário não acompanha",
          dynamicLabel: "trabalhar muito e o salário não acompanhar",
          subtitle: "Quero mais retorno pelo tempo que eu dou",
          tags: ["pain_underpaid"],
          insight: {
            eyebrow: "SEU MOMENTO",
            title: "Você precisa de retorno — não de mais correria à toa",
            body: "Pra quem rala muito e ganha pouco, o caminho é direto: loja pronta, produto escolhido e ensino de venda com mentoria ao vivo. Você foca em vender, não em montar tudo sozinho.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[4],
              imageCaption: "Print real — evolução com método",
            },
          },
        },
        {
          id: "pode_mais",
          label: "Meu trabalho paga as contas, mas sei que dá pra mais",
          dynamicLabel: "ter o trabalho que paga as contas, mas saber que dá pra mais",
          subtitle: "Quero uma segunda fonte de grana",
          tags: ["pain_ok_job"],
          insight: {
            eyebrow: "SEU MOMENTO",
            title: "Grana extra sem largar o que paga o boleto hoje",
            body: "Loja rodando em paralelo, produto validado no nicho que você escolheu e mentoria te guiando na divulgação — no seu ritmo, com call quando precisar destravar.",
            variant: "print",
            proof: {
              imageUrl: "/media/quiz-evidence/proof/notificacoes/notif-104.jpeg",
              imageCaption: "Print real — vendas caindo no celular",
            },
          },
        },
        {
          id: "estudante",
          label: "Tô estudando e quero ganhar meu dinheiro",
          dynamicLabel: "estar estudando e querer ganhar seu dinheiro",
          subtitle: "Começar antes de formar",
          tags: ["pain_student", "stage_zero"],
          insight: {
            eyebrow: "SEU MOMENTO",
            title: "Começa a ganhar enquanto ainda estuda",
            body: "Loja pronta, produto escolhido e passo a passo de divulgação — no tempo que sobra entre a faculdade ou o curso. Mentoria ao vivo quando travar.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[0],
              imageCaption: "Print real — começando cedo",
            },
          },
        },
        {
          id: "empreendo",
          label: "Já empreendo, mas quero vender online também",
          dynamicLabel: "já empreender e querer vender online também",
          subtitle: "Mais uma fonte de grana",
          tags: ["pain_entrepreneur", "goal_scale"],
          insight: {
            eyebrow: "SEU MOMENTO",
            title: "Nova loja estruturada + método de venda",
            body: "Produto validado em outro nicho, loja com cara profissional e mentoria pra organizar a divulgação — junto com gente que já tá vendendo.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[2],
              imageCaption: "Print real — quem já empreende",
            },
          },
        },
      ],
    },
    {
      id: "barreira",
      type: "choice",
      title: "O que mais te trava de ganhar dinheiro online?",
      hint: "Fala a real — a gente adapta o plano pro seu bloqueio.",
      options: [
        {
          id: "sem_caminho",
          label: "Não sei por onde começar — produto, loja, venda",
          dynamicLabel: "não saber por onde começar",
          tags: ["blocker_direction"],
          insight: {
            eyebrow: "A GENTE RESOLVE ISSO",
            title: "Loja e produto prontos — você aprende a vender",
            body: "Você não precisa ficar no Google caçando o que vender. Loja montada, produto escolhido no nicho e passo a passo de divulgação com mentoria ao vivo.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[6],
              imageCaption: "Print real — passo a passo na prática",
            },
          },
        },
        {
          id: "sem_aparecer",
          label: "Não quero aparecer, gravar vídeo ou virar influencer",
          dynamicLabel: "não querer aparecer, gravar vídeo ou virar influencer",
          tags: ["blocker_no_face", "want_anonymous"],
          insight: {
            eyebrow: "A GENTE RESOLVE ISSO",
            title: "Dá pra vender sem mostrar a cara",
            body: "Loja online + divulgação que não exige vídeo na câmera. A mentoria ensina na prática como vender — com call ao vivo quando travar.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[7],
              imageCaption: "Print real — vendas sem aparecer",
            },
          },
        },
        {
          id: "sozinho",
          label: "Já tentei sozinho e travei — curso, loja ou afiliado",
          dynamicLabel: "já ter tentado sozinho e travado",
          tags: ["blocker_isolation", "needs_support", "stage_stuck"],
          insight: {
            eyebrow: "A GENTE RESOLVE ISSO",
            title: "Não é curso gravado — é pegar na mão de verdade",
            body: "Loja pronta com produto validado + 2 calls ao vivo por semana + WhatsApp. Dúvida na hora, não vídeo que você abandona no meio.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[8],
              imageCaption: "Print real — acompanhamento de perto",
            },
          },
        },
        {
          id: "desconfianca",
          label: "Não sei se vai funcionar comigo",
          dynamicLabel: "não ter certeza se vai funcionar com você",
          tags: ["blocker_trust"],
          insight: {
            eyebrow: "A GENTE RESOLVE ISSO",
            title: "Produto validado + print de quem já vendeu",
            body: "Centenas de alunos no mesmo programa — loja entregue, produto escolhido e mentoria ao vivo. O caminho existe se você seguir o que a gente te passa.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[9],
              imageCaption: "Print real de resultado",
            },
          },
        },
        {
          id: "tempo",
          label: "Tenho pouco tempo — não dá pra montar loja do zero",
          dynamicLabel: "ter pouco tempo para montar loja do zero",
          tags: ["blocker_time", "needs_support"],
          insight: {
            eyebrow: "A GENTE RESOLVE ISSO",
            title: "Loja pronta — você só aprende a vender no seu tempo",
            body: "Sem semana montando vitrine e caçando produto. Loja entregue, produto no nicho e call ao vivo pra destravar quando precisar.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[0],
              imageCaption: "Print real — evolução no programa",
            },
          },
        },
      ],
    },
    {
      id: "situacao",
      type: "choice",
      title: "Onde você tá nessa história de vender online?",
      hint: "Do zero ou com experiência — ajustamos o ritmo do plano.",
      options: [
        {
          id: "zero",
          label: "Nunca vendi online de verdade",
          tags: ["stage_zero"],
          insight: {
            eyebrow: "COMEÇANDO DO ZERO",
            title: "Começo com loja pronta — não com tela em branco",
            body: "Produto já escolhido, loja configurada e ensino de como divulgar e vender. A mentoria ao vivo pega na sua mão desde a primeira venda.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[1],
              imageCaption: "Print real — começando do zero",
            },
          },
        },
        {
          id: "curso_parado",
          label: "Já fiz curso ou tentei loja, mas travei sozinho",
          tags: ["stage_stuck", "needs_support"],
          insight: {
            eyebrow: "QUEM JÁ TRAVOU",
            title: "Dessa vez com loja entregue e gente ao vivo",
            body: "Não é mais um curso gravado. Loja pronta, produto validado e calls semanais pra destravar na hora — com WhatsApp quando precisar.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[2],
              imageCaption: "Print real — acompanhamento de perto",
            },
          },
        },
        {
          id: "vendendo",
          label: "Já vendo e quero organizar + entrar em outro nicho",
          tags: ["stage_selling"],
          insight: {
            eyebrow: "QUEM JÁ VENDE",
            title: "Nova loja estruturada + mentoria pra escalar",
            body: "Produto validado em outro nicho, loja com identidade visual profissional e contato com quem já tá vendendo no programa.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[3],
              imageCaption: "Print real — evolução com estrutura",
            },
          },
        },
      ],
    },
    {
      id: "prova_resultados",
      type: "proof_gallery",
      title: "Resultado de quem já vendeu de verdade",
      intro: "Notificação de venda e faturamento no celular — prints reais de alunos.",
      imageUrls: [...QUIZ_FLOW_PROOF_GALLERY],
      ctaLabel: "Continuar",
    },
    {
      id: "nicho",
      type: "multichoice",
      title: "Em quais nichos você se vê vendendo?",
      hint: "Escolhe até 3 — montamos sua loja com produto nesses nichos:",
      minSelect: 1,
      maxSelect: 3,
      ctaLabel: "Continuar",
      options: [
        { id: "moda_masc", label: "Moda masculina 👕", dynamicLabel: "moda masculina", tags: ["niche_moda_masc"] },
        { id: "moda_fem", label: "Moda feminina 👗", dynamicLabel: "moda feminina", tags: ["niche_moda_fem"] },
        { id: "beleza", label: "Beleza e cosméticos 💄", dynamicLabel: "beleza e cosméticos", tags: ["niche_beleza"] },
        { id: "saude", label: "Saúde e bem-estar 🌿", dynamicLabel: "saúde e bem-estar", tags: ["niche_saude"] },
        { id: "pet", label: "Pet 🐾", dynamicLabel: "pet", tags: ["niche_pet"] },
        { id: "casa", label: "Casa e utilidades 🏠", dynamicLabel: "casa e utilidades", tags: ["niche_casa"] },
        { id: "tech", label: "Tecnologia 💻", dynamicLabel: "tecnologia", tags: ["niche_tech"] },
        { id: "infantil", label: "Infantil 🧸", dynamicLabel: "infantil", tags: ["niche_infantil"] },
      ],
    },
    {
      id: "lojas_exemplo",
      type: "store_showcase",
      title: "É assim que entregamos sua loja",
      intro: "Lojas reais de alunos — navegue pelo site como se fosse o seu. Use as setas para ver outra loja.",
      stores: [
        {
          name: "Arven",
          niche: "Moda masculina",
          storeUrl: "https://www.lojaarven.com.br/",
        },
        {
          name: "Nivra",
          niche: "Moda feminina",
          storeUrl: "https://usenivra.com/",
        },
        {
          name: "SerMente",
          niche: "Saúde & performance",
          storeUrl: "https://www.sermentesaude.com/",
        },
      ],
      ctaLabel: "Continuar",
    },
    {
      id: "depoimento_claudini",
      type: "testimonial",
      title: "Claudini — já tinha travado sozinha",
      intro: "Dessa vez veio loja pronta + suporte ao vivo de verdade.",
      name: "Claudini",
      role: "Aluna Ascend",
      quote: "Já tinha tentado sozinha e travado. Dessa vez veio loja + suporte ao vivo.",
      videoUrl: "/media/quiz-evidence/videos/02-video-claudini.mp4",
      ctaLabel: "Continuar",
    },
    {
      id: "depoimento_izabela",
      type: "testimonial",
      title: "Izabela — nunca tinha vendido online",
      intro: "Ela recebe PIX toda semana com a loja que entregaram pronta.",
      name: "Izabela",
      role: "Aluna Ascend",
      quote: "Nunca tinha vendido online. Hoje cai PIX toda semana com a loja que me entregaram pronta.",
      videoUrl: "/media/quiz-evidence/videos/06-video-izabela.mp4",
      ctaLabel: "Continuar",
    },
    {
      id: "depoimento_renata",
      type: "testimonial",
      title: "Renata — a call com o Erick muda o jogo",
      intro: "Mentoria ao vivo — não fica perdida em vídeo gravado.",
      name: "Renata",
      role: "Aluna Ascend",
      quote: "A call ao vivo com o Erick ajuda muito a ajustar as vendas.",
      videoUrl: "/media/quiz-evidence/videos/10-video-renata-mensão-erick.mp4",
      ctaLabel: "Continuar",
    },
    {
      id: "mecanismo",
      type: "mechanism",
      title: "Como você vai do zero até a primeira venda",
      intro: "Sem enrolação: isso é o que a gente entrega pra você, com base no que você acabou de contar.",
      mechanismSteps: [
        {
          title: "Você recebe a loja pronta",
          subtitle: "Produtos escolhidos no nicho que você marcou — logo, banner e visual no seu nome",
          highlight: "1 · Loja entregue",
        },
        {
          title: "A gente te ensina a divulgar e vender",
          subtitle: "Passo a passo na prática — sem precisar aparecer, se você não quiser",
          highlight: "2 · Ensino na prática",
        },
        {
          title: "Mentoria ao vivo quando você travar",
          subtitle: "2 calls por semana + WhatsApp — diferente de vídeo gravado que você abandona no meio",
          highlight: "3 · Ao vivo",
        },
      ],
      bullets: [
        "Você não monta loja nem procura produto sozinho",
        "Dá pra vender sem gravar vídeo ou virar influencer",
        "Tudo encaixado no seu momento e na sua maior trava hoje",
      ],
      ctaLabel: "ISSO FAZ SENTIDO PRA MIM",
    },
    {
      id: "prova_dinamica",
      type: "dynamic",
      title: "Seu plano, do jeito que você contou",
      body: "Olha o que montamos com base nas suas respostas:\n\n• Seu foco: {{objetivo}}\n• Seu momento hoje: {{momento}}\n• O que mais te trava: {{barreira}}\n• Nichos escolhidos: {{nicho}}\n\nSeu plano Ascend: loja pronta nesses nichos, passo a passo de divulgação e mentoria ao vivo para te acompanhar de perto — sem curso gravado que você abandona no meio.\n\nFalta pouco para o seu diagnóstico personalizado 👇",
      ctaLabel: "Continuar",
    },
    {
      id: "prioridades",
      type: "multichoice",
      title: "O que não pode faltar no SEU plano?",
      hint: "Marca até 3 — confirmamos o que a gente adapta pra você:",
      minSelect: 2,
      maxSelect: 3,
      ctaLabel: "Continuar",
      options: [
        {
          id: "loja_pronta",
          label: "Loja pronta — não montar do zero",
          tags: ["want_store"],
        },
        {
          id: "sem_aparecer",
          label: "Vender sem precisar aparecer",
          tags: ["blocker_no_face", "want_anonymous"],
        },
        {
          id: "ensino_venda",
          label: "Alguém me ensinando a vender na prática",
          tags: ["needs_support"],
        },
        {
          id: "calls_vivo",
          label: "Mentoria ao vivo — não só vídeo gravado",
          tags: ["needs_support"],
        },
        {
          id: "flexibilidade",
          label: "Trabalhar de qualquer lugar",
          tags: ["want_flexibility", "want_geo"],
        },
        {
          id: "renda",
          label: "Grana que não depende só do salário",
          tags: ["goal_income", "goal_freedom"],
        },
      ],
    },
    {
      id: "compromisso",
      type: "choice",
      title: "Você toparia começar com loja pronta + ensino de venda + mentoria ao vivo?",
      options: [
        {
          id: "sim_agora",
          label: "Sim — é exatamente o que eu preciso 🔥",
          tags: ["commit_high"],
        },
        {
          id: "sim_logo",
          label: "Sim, quero ver meu diagnóstico 🏃",
          tags: ["commit_high"],
        },
      ],
    },
    {
      id: "oferta",
      type: "offer",
      title: "Seu plano Ascend",
      body: "Pagamento único · 12 meses de acesso",
      priceLabel: "R$49,99",
      originalPriceLabel: "R$197",
      priceNote: "ou 8x de R$6,25 no cartão",
      bullets: ["Loja pronta + mentoria ao vivo"],
      ctaLabel: "LIBERAR MEU ACESSO",
    },
  ],
  calculating: {
    messages: [
      "Entendendo sua situação…",
      "Escolhendo produto no nicho que você marcou…",
      "Montando seu plano: loja + venda + mentoria…",
      "Ajustando pro que mais te trava hoje…",
      "Gerando seu diagnóstico…",
    ],
    messagesByTags: [
      {
        whenTags: ["stage_zero", "blocker_direction"],
        messages: [
          "Mapeando seu caminho do zero…",
          "Separando o passo a passo ideal…",
          "Preparando sua condição…",
        ],
      },
      {
        whenTags: ["needs_support"],
        messages: [
          "Priorizando acompanhamento ao vivo…",
          "Ajustando com suporte de perto…",
          "Finalizando sua condição…",
        ],
      },
      {
        whenTags: ["blocker_trust"],
        messages: [
          "Conferindo se encaixa no seu perfil…",
          "Validando com provas reais…",
          "Liberando sua condição…",
        ],
      },
    ],
  },
  result: {
    eyebrow: "",
    headline: "Seu plano está liberado",
    highlights: [],
  },
  resultRules: [
    {
      whenTags: ["blocker_no_face"],
      headline: "Seu plano: vender online sem aparecer",
      badge: "PERFIL IDEAL",
      highlights: [
        "Loja pronta + divulgação sem vídeo na câmera",
        "Ensino adaptado pra quem não quer ser influencer",
        "Mentoria ao vivo quando travar",
      ],
      reassurance: "Adaptamos o ensino pro seu perfil — loja, produto e suporte, sem aparecer.",
    },
    {
      whenTags: ["want_geo", "want_flexibility"],
      headline: "Seu plano: grana de qualquer lugar, com loja rodando",
      badge: "PERFIL IDEAL",
      highlights: [
        "Loja online que você opera de onde estiver",
        "Produto escolhido no nicho — sem escritório fixo",
        "Mentoria ao vivo no seu ritmo",
      ],
    },
    {
      whenTags: ["stage_zero"],
      headline: "Seu plano: começar com loja pronta, não do zero absoluto",
      badge: "ALTO POTENCIAL",
      highlights: [
        "Produto já escolhido no nicho que você marcou",
        "Ensino de venda pegando na sua mão",
        "2 calls semanais + WhatsApp",
      ],
      reassurance: "Você não monta loja sozinho — recebe pronta e aprende a vender com acompanhamento.",
    },
    {
      whenTags: ["needs_support", "stage_stuck"],
      headline: "Seu plano: loja entregue + mentoria ao vivo (não curso gravado)",
      badge: "PERFIL IDEAL",
      highlights: [
        "Pra quem já travou sozinho em curso ou loja",
        "Calls semanais + WhatsApp",
        "Produto validado — foco em vender",
      ],
    },
    {
      whenTags: ["goal_transition"],
      headline: "Seu plano: sair do CLT com loja + grana em paralelo",
      badge: "PERFIL IDEAL",
      highlights: [
        "Loja montada enquanto você ainda tem salário",
        "Ensino de venda no seu ritmo",
        "Gente na mesma virada que você",
      ],
    },
    {
      whenTags: ["commit_high"],
      headline: "Você tá pronto — plano personalizado liberado",
      badge: "ALTO POTENCIAL",
      highlights: [
        "Loja + produto + ensino de venda + mentoria ao vivo",
        "Adaptado ao que você contou no diagnóstico",
        "Condição especial nesta sessão",
      ],
    },
  ],
  testimonials: [
    {
      name: "Izabela",
      role: "Aluna Ascend",
      quote: "Nunca tinha vendido online. Hoje cai PIX toda semana com a loja que me entregaram pronta.",
      videoUrl: "/media/quiz-evidence/videos/06-video-izabela.mp4",
    },
    {
      name: "Renata",
      role: "Aluna Ascend",
      quote: "A call ao vivo com o Erick ajuda muito a ajustar as vendas.",
      videoUrl: "/media/quiz-evidence/videos/10-video-renata-mensão-erick.mp4",
    },
    {
      name: "Eros",
      role: "10 vendas no programa",
      quote: "Fiz 10 vendas seguindo o passo a passo. Loja pronta, produto bom, só aprendi a divulgar.",
      videoUrl: "/media/quiz-evidence/videos/01-eros-10-vendas.mp4",
    },
    {
      name: "Karen",
      role: "Aluna Ascend",
      quote: "Trabalho de casa, no meu tempo, e a venda vai caindo no PIX.",
      videoUrl: "/media/quiz-evidence/videos/07-video-karen.mp4",
    },
    {
      name: "Claudini",
      role: "Aluna Ascend",
      quote: "Já tinha tentado sozinha e travado. Dessa vez veio loja + suporte ao vivo.",
      videoUrl: "/media/quiz-evidence/videos/02-video-claudini.mp4",
    },
  ],
  contact: {
    nameTitle: "Qual seu nome?",
    nameHint: "Pra personalizar seu diagnóstico.",
    ageTitle: "Qual sua idade?",
    ageHint: "Só pra encaixar o plano no seu momento de vida.",
    incomeTitle: "Quanto você ganha hoje?",
    incomeHint: "Valor mensal aproximado — sem julgamento.",
    emailTitle: "Qual seu melhor e-mail?",
    emailHint: "Pra te enviar seu diagnóstico e liberar o checkout.",
    phoneTitle: "Seu WhatsApp",
    phoneHint: "Usamos só pro suporte do programa.",
    submitLabel: "CONTINUAR DIAGNÓSTICO",
  },
};

/** Preenche campos obrigatórios ausentes em configs parciais salvas no Supabase. */
export function mergeAdsQuizConfigDefaults(raw: unknown): AdsQuizConfig {
  if (!raw || typeof raw !== "object") return DEFAULT_ADS_QUIZ_CONFIG;
  const partial = raw as Partial<AdsQuizConfig>;
  return {
    ...DEFAULT_ADS_QUIZ_CONFIG,
    ...partial,
    landing: { ...DEFAULT_ADS_QUIZ_CONFIG.landing, ...partial.landing },
    contact: { ...DEFAULT_ADS_QUIZ_CONFIG.contact, ...partial.contact },
    steps: partial.steps ?? DEFAULT_ADS_QUIZ_CONFIG.steps,
    calculating: partial.calculating ?? DEFAULT_ADS_QUIZ_CONFIG.calculating,
    result: partial.result ?? DEFAULT_ADS_QUIZ_CONFIG.result,
    resultRules: partial.resultRules ?? DEFAULT_ADS_QUIZ_CONFIG.resultRules,
    testimonials: partial.testimonials ?? DEFAULT_ADS_QUIZ_CONFIG.testimonials,
  };
}

export function parseAdsQuizConfig(raw: unknown) {
  return adsQuizConfigSchema.safeParse(mergeAdsQuizConfigDefaults(raw));
}

export const adsQuizConfigUpdateSchema = adsQuizConfigSchema;

/** Config legada (sem campos novos) — retrocompatibilidade. */
export const LEGACY_ADS_QUIZ_CONFIG = {
  version: 1 as const,
  landing: {
    eyebrow: "Ascend Club · diagnóstico rápido",
    headline: "Veja se o Ascend Club é o próximo passo para construir sua renda online",
    subheadline: "Menos de 2 minutos. Mentoria em grupo, suporte próximo e método validado.",
    ctaLabel: "COMEÇAR",
    socialProof: "Mais de 500 alunos aplicando o método Ascend",
  },
  steps: [
    {
      id: "objetivo",
      type: "choice" as const,
      title: "Qual é o seu principal objetivo?",
      options: [
        { id: "renda_extra", label: "Ganhar uma renda extra" },
        { id: "sair_clt", label: "Sair do CLT e trabalhar online" },
        { id: "liberdade", label: "Alcançar liberdade financeira" },
      ],
    },
    {
      id: "oferta",
      type: "offer" as const,
      title: "Sua vaga no Ascend Club",
      body: "Pagamento único. 12 meses de acesso.",
      priceLabel: "R$49,99",
      bullets: ["Método para iniciantes", "2 calls ao vivo por semana"],
      ctaLabel: "Quero entrar",
    },
  ],
  contact: DEFAULT_ADS_QUIZ_CONFIG.contact,
};
