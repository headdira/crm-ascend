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

/** Prints reais servidos em /public/media/proof (mesmos da landing). */
export const QUIZ_PROOF_IMAGES = [
  "/media/proof/proof-01.jpeg",
  "/media/proof/proof-02.jpg",
  "/media/proof/proof-03.jpeg",
  "/media/proof/proof-04.jpeg",
  "/media/proof/proof-05.jpeg",
  "/media/proof/proof-06.jpeg",
  "/media/proof/proof-07.jpeg",
  "/media/proof/proof-08.jpg",
  "/media/proof/proof-09.jpg",
  "/media/proof/proof-10.jpg",
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
  version: z.literal(1),
  landing: z.object({
    eyebrow: z.string().max(120),
    headline: z.string().min(1).max(400),
    subheadline: z.string().max(600),
    ctaLabel: z.string().min(1).max(80),
    socialProof: z.string().max(200).optional(),
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
      }),
    )
    .max(6)
    .optional(),
  contact: z.object({
    nameTitle: z.string().min(1).max(120),
    nameHint: z.string().max(300).optional(),
    emailTitle: z.string().min(1).max(120),
    emailHint: z.string().max(300).optional(),
    phoneTitle: z.string().min(1).max(120),
    phoneHint: z.string().max(300).optional(),
    submitLabel: z.string().min(1).max(80),
  }),
});

export type AdsQuizConfig = z.infer<typeof adsQuizConfigSchema>;
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

export function resolveChoiceLabel(
  steps: AdsQuizStep[],
  answers: Record<string, string>,
  stepId: string,
): string {
  const step = steps.find((s) => s.id === stepId);
  if (!step || (step.type !== "choice" && step.type !== "multichoice")) return "";
  const raw = answers[stepId];
  if (!raw) return "";
  if (step.type === "multichoice") {
    return raw
      .split(",")
      .filter(Boolean)
      .map((id) => step.options.find((o) => o.id === id)?.label)
      .filter(Boolean)
      .join(", ");
  }
  return step.options.find((o) => o.id === raw)?.label ?? "";
}

export function resolveDynamicBody(
  body: string,
  answers: Record<string, string>,
  steps: AdsQuizStep[],
): string {
  return body.replace(/\{\{(\w+)\}\}/g, (_, stepId: string) =>
    resolveChoiceLabel(steps, answers, stepId),
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
  version: 1,
  landing: {
    eyebrow: "Diagnóstico gratuito · Ascend Club",
    headline:
      "Veja se o Ascend Club resolve o que você busca: renda online, liberdade financeira e geográfica — sem precisar aparecer",
    subheadline:
      "Responda em poucos minutos. Entendemos seu momento e mostramos o plano adaptado: loja pronta com produtos selecionados, ensino de como vender e mentoria ao vivo. Não é curso gravado. Sem cartão.",
    ctaLabel: "COMEÇAR MEU DIAGNÓSTICO",
    socialProof: "⚡ +500 alunos já no programa — loja, vendas e mentoria ao vivo",
  },
  steps: [
    {
      id: "objetivo",
      type: "choice",
      title: "O que você mais quer resolver agora?",
      hint: "Seu problema define como vamos adaptar o programa pra você.",
      options: [
        {
          id: "renda_extra",
          label: "Ter uma renda extra consistente",
          subtitle: "Mais dinheiro entrando todo mês",
          tags: ["goal_income"],
          insight: {
            eyebrow: "SEU PLANO",
            title: "Renda extra sem montar negócio do zero",
            body: "Você recebe loja pronta com produtos já selecionados no nicho, aprende a divulgar e vender com acompanhamento — e tem 2 calls ao vivo por semana quando travar.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[0],
              imageCaption: "Print real — renda online no Ascend Club",
            },
          },
        },
        {
          id: "liberdade_fin",
          label: "Conquistar liberdade financeira",
          subtitle: "Não depender só de salário ou de um emprego",
          tags: ["goal_freedom", "goal_income"],
          insight: {
            eyebrow: "SEU PLANO",
            title: "Uma loja que gera renda com método e suporte",
            body: "Loja online pronta, produtos validados e ensino de como vender — com mentoria ao vivo pegando na sua mão. Não é curso que você assiste e fica perdido.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[1],
              imageCaption: "Print real — resultado no digital",
            },
          },
        },
        {
          id: "liberdade_geo",
          label: "Liberdade geográfica — trabalhar de onde eu quiser",
          subtitle: "Renda online sem ficar preso a um lugar",
          tags: ["want_flexibility", "want_geo"],
          insight: {
            eyebrow: "SEU PLANO",
            title: "Loja online que roda de qualquer lugar",
            body: "Você vende pela internet com loja pronta e produtos selecionados — sem escritório, sem chefe, sem horário fixo. A mentoria te ensina a divulgar e destrava nas calls ao vivo.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[2],
              imageCaption: "Print real — liberdade com loja online",
            },
          },
        },
        {
          id: "transicao",
          label: "Sair do CLT e construir renda online",
          subtitle: "Virada com estrutura, não no escuro",
          tags: ["goal_transition"],
          insight: {
            eyebrow: "SEU PLANO",
            title: "Transição guiada — loja + vendas + mentoria",
            body: "Enquanto você ainda tem renda fixa, montamos sua loja com produtos validados e te ensinamos a vender com suporte ao vivo. Networking com quem está na mesma virada.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[3],
              imageCaption: "Print real — transição para o digital",
            },
          },
        },
      ],
    },
    {
      id: "momento",
      type: "choice",
      title: "Qual frase melhor descreve seu momento hoje?",
      hint: "Isso nos ajuda a adaptar o plano — loja, produtos e mentoria — ao que você vive agora.",
      options: [
        {
          id: "esforco_pouco",
          label: "Trabalho muito e ganho pouco pro tanto que me esforço",
          subtitle: "Quero mais retorno pelo meu tempo",
          tags: ["pain_underpaid"],
          insight: {
            eyebrow: "ADAPTADO AO SEU MOMENTO",
            title: "Você precisa de retorno — não de mais esforço às cegas",
            body: "Pra quem trabalha muito e ganha pouco, o plano é direto: loja pronta, produtos selecionados e ensino de vendas com mentoria ao vivo. Você foca em vender, não em montar tudo sozinho.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[4],
              imageCaption: "Print real — evolução com método",
            },
          },
        },
        {
          id: "pode_mais",
          label: "Tenho um trabalho ok, mas sei que posso mais",
          subtitle: "Quero uma segunda fonte de renda",
          tags: ["pain_ok_job"],
          insight: {
            eyebrow: "ADAPTADO AO SEU MOMENTO",
            title: "Renda extra sem largar o que já te paga as contas",
            body: "Loja online rodando em paralelo, produtos validados no nicho e mentoria te guiando na divulgação — no seu ritmo, com calls quando precisar destravar.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[5],
              imageCaption: "Print real — renda extra no programa",
            },
          },
        },
        {
          id: "estudante",
          label: "Estou estudando e quero começar a ganhar meu dinheiro",
          subtitle: "Construir enquanto aprende",
          tags: ["pain_student", "stage_zero"],
        },
        {
          id: "sem_renda",
          label: "Estou sem renda fixa e preciso resolver isso",
          subtitle: "Urgência real",
          tags: ["pain_no_income", "needs_support"],
        },
        {
          id: "empreendo",
          label: "Já empreendo, mas quero uma nova fonte de receita",
          subtitle: "Diversificar com digital",
          tags: ["pain_entrepreneur", "goal_scale"],
        },
      ],
    },
    {
      id: "barreira",
      type: "choice",
      title: "O que mais te impede de ter renda online hoje?",
      hint: "Seu bloqueio define como adaptamos o plano pra você.",
      options: [
        {
          id: "sem_caminho",
          label: "Não sei por onde começar — produto, loja, venda",
          tags: ["blocker_direction"],
          insight: {
            eyebrow: "REMÉDIO PRA ISSO",
            title: "A gente entrega a loja e os produtos — você aprende a vender",
            body: "Você não precisa descobrir sozinho o que vender. Loja pronta, produtos selecionados no nicho e passo a passo de divulgação com mentoria ao vivo.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[6],
              imageCaption: "Print real — passo a passo aplicado",
            },
          },
        },
        {
          id: "sem_aparecer",
          label: "Não quero aparecer, gravar vídeo ou ser influencer",
          tags: ["blocker_no_face", "want_anonymous"],
          insight: {
            eyebrow: "REMÉDIO PRA ISSO",
            title: "Você vende sem precisar mostrar o rosto",
            body: "Loja online + divulgação que não exige vídeo na câmera. A mentoria ensina na prática como vender esses produtos — com calls ao vivo quando travar.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[7],
              imageCaption: "Print real — vendas sem aparecer",
            },
          },
        },
        {
          id: "sozinho",
          label: "Já tentei e travei sozinho — curso, loja ou afiliado",
          tags: ["blocker_isolation", "needs_support", "stage_stuck"],
          insight: {
            eyebrow: "REMÉDIO PRA ISSO",
            title: "Não é curso gravado — é pegar na mão e ensinar a vender",
            body: "Loja pronta com produtos validados + 2 calls ao vivo por semana + WhatsApp. Dúvida na hora, não módulo abandonado.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[8],
              imageCaption: "Print real — acompanhamento no programa",
            },
          },
        },
        {
          id: "desconfianca",
          label: "Não sei se vai funcionar pra mim",
          tags: ["blocker_trust"],
          insight: {
            eyebrow: "REMÉDIO PRA ISSO",
            title: "Produtos validados + prints reais de quem já vendeu",
            body: "Centenas de alunos no mesmo programa — loja entregue, produtos selecionados e mentoria ao vivo. O caminho existe se você seguir o direcionamento.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[9],
              imageCaption: "Print real de resultado",
            },
          },
        },
        {
          id: "tempo",
          label: "Tenho pouco tempo — não posso montar loja do zero",
          tags: ["blocker_time", "needs_support"],
          insight: {
            eyebrow: "REMÉDIO PRA ISSO",
            title: "Loja pronta — você só aprende a vender no seu ritmo",
            body: "Sem semanas montando vitrine e caçando produto. Loja entregue, produtos no nicho e calls ao vivo pra destravar quando precisar.",
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
      title: "Onde você está hoje nessa jornada?",
      hint: "Isso ajusta o ritmo do plano — do zero ou com experiência.",
      options: [
        {
          id: "zero",
          label: "Nunca vendi online de verdade",
          tags: ["stage_zero"],
          insight: {
            eyebrow: "PLANO DO ZERO",
            title: "Começo com loja pronta — não com tela em branco",
            body: "Produtos já selecionados, loja configurada e ensino de como divulgar e vender. A mentoria ao vivo pega na sua mão desde a primeira venda.",
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
            eyebrow: "PLANO PRA QUEM TRAVOU",
            title: "Dessa vez com loja entregue e gente ao vivo",
            body: "Não é mais um curso gravado. Loja pronta, produtos validados e calls semanais pra destravar na hora — com WhatsApp quando precisar.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[2],
              imageCaption: "Print real — acompanhamento no programa",
            },
          },
        },
        {
          id: "vendendo",
          label: "Já vendo e quero estrutura + novo nicho",
          tags: ["stage_selling"],
          insight: {
            eyebrow: "PLANO PRA ESCALAR",
            title: "Nova loja estruturada + mentoria para organizar vendas",
            body: "Produtos validados em outro nicho, identidade visual profissional e networking com quem já está vendendo no programa.",
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
      id: "nicho",
      type: "multichoice",
      title: "Em quais nichos você se vê vendendo?",
      hint: "Escolha até 3 — definimos os produtos da sua loja:",
      minSelect: 1,
      maxSelect: 3,
      ctaLabel: "Continuar",
      options: [
        { id: "moda_masc", label: "Moda masculina 👕", tags: ["niche_moda_masc"] },
        { id: "moda_fem", label: "Moda feminina 👗", tags: ["niche_moda_fem"] },
        { id: "beleza", label: "Beleza e cosméticos 💄", tags: ["niche_beleza"] },
        { id: "saude", label: "Saúde e bem-estar 🌿", tags: ["niche_saude"] },
        { id: "pet", label: "Pet 🐾", tags: ["niche_pet"] },
        { id: "casa", label: "Casa e praticidade 🏠", tags: ["niche_casa"] },
        { id: "tech", label: "Tecnologia 💻", tags: ["niche_tech"] },
        { id: "infantil", label: "Infantil 🧸", tags: ["niche_infantil"] },
      ],
    },
    {
      id: "mecanismo",
      type: "mechanism",
      title: "O que o Ascend Club entrega — o remédio completo",
      intro: "Não é curso comum. É loja + produtos + ensino de vendas + mentoria ao vivo, adaptado ao que você respondeu.",
      mechanismSteps: [
        {
          title: "Loja pronta com produtos selecionados",
          subtitle: "No nicho que você escolheu — com logo, banner e identidade visual personalizados",
          highlight: "1 · Loja entregue",
        },
        {
          title: "A gente pega na sua mão e ensina a vender",
          subtitle: "Como divulgar esses produtos e fazer as primeiras vendas — passo a passo, sem aparecer se não quiser",
          highlight: "2 · Ensino de vendas",
        },
        {
          title: "Mentoria ao vivo + suporte quando travar",
          subtitle: "2 calls por semana, WhatsApp e networking — diferente de curso gravado que você assiste sozinho",
          highlight: "3 · Ao vivo",
        },
      ],
      bullets: [
        "Você não monta loja nem caça produto sozinho",
        "Pode vender sem gravar vídeo ou aparecer",
        "Plano adaptado ao seu momento e ao seu bloqueio",
      ],
      ctaLabel: "ISSO FAZ SENTIDO PRA MIM",
    },
    {
      id: "prova_dinamica",
      type: "dynamic",
      title: "Seu plano, adaptado ao que você contou",
      body: "Você busca {{objetivo}}, está num momento de {{momento}}, e o que mais te impede é: {{barreira}}.\n\nNichos escolhidos: {{nicho}}.\n\nO plano Ascend pra você: loja pronta com produtos selecionados nesses nichos + ensino de como vender + mentoria ao vivo pegando na sua mão. Não é curso gravado.\n\nFalta pouco pro seu diagnóstico final 👇",
      ctaLabel: "Continuar",
      imageUrl: QUIZ_PROOF_IMAGES[5],
    },
    {
      id: "prioridades",
      type: "multichoice",
      title: "O que não pode faltar no SEU plano?",
      hint: "Escolha até 3 — confirmamos o que adaptamos pra você:",
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
          label: "Renda que não depende só de salário",
          tags: ["goal_income", "goal_freedom"],
        },
      ],
    },
    {
      id: "compromisso",
      type: "choice",
      title: "Você começaria com loja pronta + ensino de vendas + mentoria ao vivo?",
      options: [
        {
          id: "sim_agora",
          label: "Sim — é exatamente o que preciso 🔥",
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
      id: "autoridade",
      type: "message",
      title: "Quem monta sua loja e te ensina a vender",
      variant: "authority",
      imageUrl: "/media/mentor-kelvin.jpeg",
      body: "Kelvin Martins e Erick Vinicius, co-fundadores do Ascend Club.\n\nEntregamos loja online pronta com produtos selecionados, pegamos na mão de cada aluno pra ensinar a vender — e acompanhamos com calls ao vivo e suporte no WhatsApp.\n\nNão somos curso gravado. Somos loja + vendas + mentoria real.",
      ctaLabel: "GERAR MEU DIAGNÓSTICO",
    },
    {
      id: "oferta",
      type: "offer",
      title: "Seu plano Ascend Club — loja + vendas + mentoria",
      body: "Loja online pronta com produtos selecionados no seu nicho, ensino de como divulgar e vender, e 12 meses de mentoria ao vivo com suporte próximo. Pagamento único.",
      priceLabel: "R$60",
      originalPriceLabel: "R$197",
      urgencyNote: "Plano personalizado liberado só nesta sessão",
      priceNote: "Menos de R$0,17 por dia · loja + mentoria 1 ano",
      bullets: [
        "Loja pronta com produtos validados no nicho escolhido",
        "Logo, banner e identidade visual personalizados",
        "Ensino de como divulgar e vender esses produtos",
        "2 calls ao vivo por semana + suporte no WhatsApp",
        "Networking com +500 alunos no mesmo programa",
        "Venda sem precisar aparecer ou gravar vídeo",
      ],
      ctaLabel: "QUERO MEU PLANO COMPLETO",
    },
  ],
  calculating: {
    messages: [
      "Entendendo seu problema e seu momento…",
      "Selecionando produtos do nicho escolhido…",
      "Montando seu plano: loja + vendas + mentoria…",
      "Adaptando ao que mais te impede hoje…",
      "Gerando seu diagnóstico personalizado…",
    ],
    messagesByTags: [
      {
        whenTags: ["stage_zero", "blocker_direction"],
        messages: [
          "Mapeando seu caminho do zero…",
          "Selecionando o passo a passo ideal…",
          "Preparando sua condição de entrada…",
        ],
      },
      {
        whenTags: ["needs_support"],
        messages: [
          "Priorizando acompanhamento ao vivo…",
          "Ajustando recomendação com suporte próximo…",
          "Finalizando sua condição…",
        ],
      },
      {
        whenTags: ["blocker_trust"],
        messages: [
          "Validando fit com o método Ascend…",
          "Conferindo provas do seu perfil…",
          "Liberando sua condição…",
        ],
      },
    ],
  },
  result: {
    eyebrow: "SEU PLANO ESTÁ PRONTO",
    headline: "Adaptamos o Ascend Club ao seu problema e ao seu momento",
    badge: "PERFIL IDEAL",
    highlights: [
      "Loja pronta com produtos selecionados no nicho que você escolheu",
      "Ensino de vendas + mentoria ao vivo — não é curso gravado",
      "Plano montado com base no que você contou neste diagnóstico",
    ],
    reassurance:
      "Com base nas suas respostas, liberamos seu plano personalizado nesta sessão — válido enquanto esta página estiver aberta.",
  },
  resultRules: [
    {
      whenTags: ["blocker_no_face"],
      headline: "Seu plano: vender online sem precisar aparecer",
      badge: "PERFIL IDEAL",
      highlights: [
        "Loja pronta + divulgação sem vídeo na câmera",
        "Ensino de vendas adaptado pra quem não quer ser influencer",
        "Mentoria ao vivo quando travar",
      ],
      reassurance: "Adaptamos o ensino de vendas pro seu perfil — loja, produtos e suporte, sem aparecer.",
    },
    {
      whenTags: ["want_geo", "want_flexibility"],
      headline: "Seu plano: renda de qualquer lugar, com loja rodando",
      badge: "PERFIL IDEAL",
      highlights: [
        "Loja online que você opera de onde estiver",
        "Produtos selecionados no nicho — sem escritório fixo",
        "Mentoria ao vivo no seu ritmo",
      ],
    },
    {
      whenTags: ["stage_zero"],
      headline: "Seu plano: começar com loja pronta, não do zero absoluto",
      badge: "ALTO POTENCIAL",
      highlights: [
        "Produtos já selecionados no nicho escolhido",
        "Ensino de vendas pegando na sua mão",
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
        "Calls semanais + suporte no WhatsApp",
        "Produtos validados — foco em vender",
      ],
    },
    {
      whenTags: ["goal_transition"],
      headline: "Seu plano: transição guiada com loja + renda em paralelo",
      badge: "PERFIL IDEAL",
      highlights: [
        "Loja montada enquanto você mantém o CLT",
        "Ensino de vendas no seu ritmo",
        "Networking com quem está na mesma virada",
      ],
    },
    {
      whenTags: ["commit_high"],
      headline: "Você está pronto — plano personalizado liberado",
      badge: "ALTO POTENCIAL",
      highlights: [
        "Loja + produtos + ensino de vendas + mentoria ao vivo",
        "Adaptado ao que você contou no diagnóstico",
        "Condição especial nesta sessão",
      ],
    },
  ],
  testimonials: [],
  contact: {
    nameTitle: "Como posso te chamar?",
    nameHint: "Só seu primeiro nome — para personalizar seu acesso.",
    emailTitle: "Qual seu melhor e-mail?",
    emailHint: "Para liberar seu checkout seguro na Kiwify.",
    phoneTitle: "Seu WhatsApp",
    phoneHint: "Usamos só para suporte do programa. Em seguida você vai para o pagamento.",
    submitLabel: "LIBERAR MEU ACESSO",
  },
};

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
      priceLabel: "R$197",
      bullets: ["Método para iniciantes", "2 calls ao vivo por semana"],
      ctaLabel: "Quero entrar",
    },
  ],
  contact: DEFAULT_ADS_QUIZ_CONFIG.contact,
};
