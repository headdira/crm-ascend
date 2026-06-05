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
      "Receba seu diagnóstico e veja sua loja online pronta — com produtos validados no nicho que você escolher",
    subheadline:
      "Logo, banner e identidade visual do seu jeito. Loja pronta pra rodar + mentoria ao vivo para você vender sem ficar sozinho. Sem cartão agora.",
    ctaLabel: "QUERO VER MINHA LOJA IDEAL",
    socialProof: "⚡ +500 alunos já receberam loja pronta e aplicam o método Ascend",
  },
  steps: [
    {
      id: "objetivo",
      type: "choice",
      title: "O que você quer conquistar com sua loja online?",
      hint: "Isso define o foco do seu diagnóstico e da loja que vamos montar pra você.",
      options: [
        {
          id: "renda_extra",
          label: "Uma renda extra consistente",
          subtitle: "Loja rodando sem largar o que faço hoje",
          tags: ["goal_income"],
          insight: {
            eyebrow: "LOJA PRONTA",
            title: "Você não começa do zero — começa com loja montada",
            body: "No Ascend Club você recebe loja online pronta, com produtos validados no nicho que escolher, logo, banner e identidade visual personalizados. Depois é só colocar no ar e seguir o método com calls ao vivo.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[0],
              imageCaption: "Print real — loja no ar no Ascend Club",
            },
          },
        },
        {
          id: "transicao",
          label: "Sair do CLT e viver do digital",
          subtitle: "Liberdade com uma loja que já vem estruturada",
          tags: ["goal_transition"],
          insight: {
            eyebrow: "SUA VIRADA",
            title: "Loja pronta + mentoria — sem montar tudo sozinho",
            body: "Você escolhe o nicho, recebe a loja com produtos validados e identidade visual pronta. Enquanto isso, entra na mentoria com networking e suporte próximo para não travar na transição.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[1],
              imageCaption: "Print real — resultado com loja online",
            },
          },
        },
        {
          id: "escala",
          label: "Escalar o que já vendo online",
          subtitle: "Nova loja estruturada ou segundo canal de venda",
          tags: ["goal_scale"],
          insight: {
            eyebrow: "PRÓXIMO NÍVEL",
            title: "Estrutura profissional desde o dia 1",
            body: "Loja pronta com vitrine, produtos e identidade visual — mais networking e calls para escalar com consistência, sem perder tempo configurando tudo na mão.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[2],
              imageCaption: "Print real — escala com loja estruturada",
            },
          },
        },
      ],
    },
    {
      id: "momento",
      type: "choice",
      title: "Qual frase melhor descreve sua situação hoje?",
      hint: "Seja honesto — isso personaliza seu diagnóstico.",
      options: [
        {
          id: "esforco_pouco",
          label: "Trabalho muito e ganho pouco pro tanto que me esforço",
          subtitle: "Quero mais retorno pelo meu tempo",
          tags: ["pain_underpaid"],
          insight: {
            eyebrow: "CHEGA DE REINVENTAR",
            title: "Sua loja já vem montada — você foca em vender",
            body: "Enquanto a maioria perde semanas criando loja, escolhendo produto e testando banner, no Ascend você recebe tudo pronto no nicho certo e segue o método com calls ao vivo.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[3],
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
            eyebrow: "RENDA EXTRA REAL",
            title: "Loja pronta como segunda fonte — sem começar do zero",
            body: "Produtos validados, logo, banner e identidade visual já configurados no nicho que você escolher. Você entra, coloca no ar e vende com suporte da mentoria.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[4],
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
      id: "historia",
      type: "message",
      title: "A maioria trava antes de vender. Você não precisa.",
      variant: "story",
      body: "A maioria desiste no meio do caminho: fica semanas escolhendo produto, montando loja, testando logo, sem saber se vai vender.\n\nNo Ascend Club é diferente: você escolhe o nicho, recebe a loja pronta com produtos validados, logo, banner e identidade visual personalizados — e entra na mentoria com calls ao vivo, networking e suporte no WhatsApp para colocar no ar e vender.\n\nNão é mais um curso gravado. É loja entregue + acompanhamento real.",
      ctaLabel: "CONTINUAR MINHA ANÁLISE",
    },
    {
      id: "mecanismo",
      type: "mechanism",
      title: "Como funciona: da loja pronta à primeira venda",
      intro: "Você não monta loja na mão. A gente entrega pronta — você escolhe o nicho e personaliza a identidade visual.",
      mechanismSteps: [
        {
          title: "Escolher seu nicho e receber a loja pronta",
          subtitle: "Produtos validados, logo, banner e identidade visual do seu jeito — pronta pra rodar",
          highlight: "Loja entregue",
        },
        {
          title: "Colocar no ar e começar a divulgar",
          subtitle: "Método passo a passo para tráfego e primeiras vendas — sem adivinhar o que fazer",
          highlight: "Pronta pra vender",
        },
        {
          title: "Vender com suporte real por perto",
          subtitle: "2 calls ao vivo por semana + WhatsApp + networking com +500 alunos",
          highlight: "Não fica sozinho",
        },
      ],
      bullets: [
        "Produtos validados por nicho — sem caçar fornecedor sozinho",
        "Logo, banner e cores personalizados na sua loja",
        "Mentoria ao vivo — não é curso gravado que você assiste e trava",
      ],
      ctaLabel: "QUERO MINHA LOJA PRONTA",
    },
    {
      id: "nicho",
      type: "multichoice",
      title: "Com quais nichos você mais se identifica?",
      hint: "Escolha até 3 — vamos cruzar com os produtos validados da sua loja:",
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
      id: "prova_dinamica",
      type: "dynamic",
      title: "Sua loja pode ser montada no nicho certo",
      body: "Mais de 500 alunos já receberam loja pronta com produtos validados e identidade visual personalizada.\n\nVocê busca {{objetivo}}, está num momento de {{momento}} e se identifica com {{nicho}}.\n\nCom esse perfil, montamos sua recomendação: loja pronta no nicho ideal + mentoria para você colocar no ar e vender.\n\nContinue para finalizar seu diagnóstico 👇",
      ctaLabel: "Continuar minha análise",
      imageUrl: QUIZ_PROOF_IMAGES[5],
    },
    {
      id: "situacao",
      type: "choice",
      title: "Onde você está hoje com loja online?",
      options: [
        {
          id: "zero",
          label: "Nunca tive uma loja de verdade",
          tags: ["stage_zero"],
          insight: {
            eyebrow: "PERFEITO PRA COMEÇAR",
            title: "Você não monta nada — recebe a loja pronta",
            body: "Escolhe o nicho, personaliza logo e banner, e entra com produtos validados já configurados. A mentoria te guia para colocar no ar e fazer as primeiras vendas.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[3],
              imageCaption: "Print real — começando do zero",
            },
          },
        },
        {
          id: "curso_parado",
          label: "Já tentei montar loja ou curso, mas travei sozinho",
          tags: ["stage_stuck", "needs_support"],
          insight: {
            eyebrow: "LOJA PRONTA + SUPORTE",
            title: "Chega de montar loja na mão e travar no meio",
            body: "Aqui você recebe loja pronta com produtos validados e identidade visual. As 2 calls ao vivo por semana existem pra destravar na hora — não é vídeo gravado sem resposta.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[4],
              imageCaption: "Print real — acompanhamento no programa",
            },
          },
        },
        {
          id: "vendendo",
          label: "Já vendo online e quero loja mais estruturada",
          tags: ["stage_selling"],
          insight: {
            eyebrow: "VITRINE PROFISSIONAL",
            title: "Loja com identidade visual forte + networking para escalar",
            body: "Receba loja pronta com produtos validados no nicho, logo e banner profissionais — e use calls + comunidade para organizar o próximo nível das vendas.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[5],
              imageCaption: "Print real — evolução com estrutura",
            },
          },
        },
      ],
    },
    {
      id: "barreira",
      type: "choice",
      title: "O que mais te trava de ter uma loja vendendo?",
      options: [
        {
          id: "sem_caminho",
          label: "Não sei por onde começar (produto, loja, visual)",
          tags: ["blocker_direction"],
          insight: {
            eyebrow: "JÁ RESOLVIDO PRA VOCÊ",
            title: "Loja + produtos + identidade visual — tudo entregue",
            body: "Você escolhe o nicho. A gente entrega loja pronta com produtos validados, logo, banner e identidade visual. Você só segue o passo a passo para colocar no ar e divulgar.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[6],
              imageCaption: "Print real — passo a passo aplicado",
            },
          },
        },
        {
          id: "sozinho",
          label: "Me sinto sozinho montando loja e vendendo",
          tags: ["blocker_isolation", "needs_support"],
          insight: {
            eyebrow: "LOJA PRONTA + TIME",
            title: "Você não monta sozinho — e não vende sozinho",
            body: "Loja entregue pronta + 2 calls ao vivo por semana + WhatsApp + networking com +500 alunos. Suporte real enquanto você coloca a loja no ar.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[7],
              imageCaption: "Print real — comunidade Ascend Club",
            },
          },
        },
        {
          id: "desconfianca",
          label: "Não sei se os produtos vão vender no meu nicho",
          tags: ["blocker_trust"],
          insight: {
            eyebrow: "PRODUTOS VALIDADOS",
            title: "Catálogo testado por nicho — não é achismo",
            body: "Os produtos da sua loja já foram validados no nicho que você escolher. Centenas de alunos já receberam loja pronta e aplicaram o método com prints reais de resultado.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[8],
              imageCaption: "Print real de resultado — mesmos da landing",
            },
          },
        },
        {
          id: "tempo",
          label: "Tenho pouco tempo pra montar loja do zero",
          tags: ["blocker_time", "needs_support"],
          insight: {
            eyebrow: "LOJA PRONTA = TEMPO",
            title: "Semanas montando loja? Aqui você pula essa parte",
            body: "Loja pronta com produtos, logo e banner já configurados. Você foca em colocar no ar e vender — com calls ao vivo quando travar.",
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[9],
              imageCaption: "Print real — suporte e evolução no programa",
            },
          },
        },
      ],
    },
    {
      id: "prioridades",
      type: "multichoice",
      title: "O que mais importa na sua loja online?",
      hint: "Escolha até 3 — isso personaliza sua recomendação:",
      minSelect: 2,
      maxSelect: 3,
      ctaLabel: "Continuar",
      options: [
        {
          id: "loja_pronta",
          label: "Loja pronta com produtos validados no nicho",
          tags: ["want_store"],
        },
        {
          id: "visual",
          label: "Logo, banner e identidade visual personalizados",
          tags: ["want_branding"],
        },
        {
          id: "suporte",
          label: "Suporte ao vivo quando travar na venda",
          tags: ["needs_support"],
        },
        {
          id: "metodo",
          label: "Passo a passo para divulgar e vender",
          tags: ["blocker_direction"],
        },
        {
          id: "networking",
          label: "Networking com outros lojistas do programa",
          tags: ["want_networking"],
        },
        {
          id: "flexibilidade",
          label: "Vender de qualquer lugar, no meu ritmo",
          tags: ["want_flexibility"],
        },
      ],
    },
    {
      id: "compromisso",
      type: "choice",
      title: "Você começaria com loja pronta + mentoria assim?",
      options: [
        {
          id: "sim_agora",
          label: "Com certeza! Quero minha loja pronta 🔥",
          tags: ["commit_high"],
        },
        {
          id: "sim_logo",
          label: "Sim, quero receber a loja e começar 🏃",
          tags: ["commit_high"],
        },
      ],
    },
    {
      id: "autoridade",
      type: "message",
      title: "Quem entrega sua loja e te acompanha na venda",
      variant: "authority",
      imageUrl: "/media/mentor-kelvin.jpeg",
      body: "Somos Kelvin Martins e Erick Vinicius, co-fundadores do Ascend Club.\n\nJá entregamos lojas prontas com produtos validados, logo, banner e identidade visual para centenas de alunos — e acompanhamos com calls ao vivo, networking e suporte no WhatsApp até a loja estar vendendo.\n\nNão é curso gravado. É loja entregue + mentoria real.",
      ctaLabel: "GERAR MEU DIAGNÓSTICO",
    },
    {
      id: "oferta",
      type: "offer",
      title: "Sua loja pronta + 12 meses de mentoria Ascend Club",
      body: "Loja online com produtos validados no nicho que você escolher, logo, banner e identidade visual personalizados — pronta pra rodar. Inclui mentoria em grupo, calls ao vivo e suporte próximo.",
      priceLabel: "R$60",
      originalPriceLabel: "R$197",
      urgencyNote: "Condição com loja pronta liberada só nesta sessão de diagnóstico",
      priceNote: "Menos de R$0,17 por dia · loja + 1 ano de mentoria",
      bullets: [
        "Loja online pronta com produtos validados no seu nicho",
        "Logo, banner e identidade visual personalizados",
        "Loja configurada e pronta pra colocar no ar",
        "Método passo a passo para divulgar e vender",
        "2 calls ao vivo por semana + suporte no WhatsApp",
        "Networking exclusivo com +500 alunos",
      ],
      ctaLabel: "QUERO MINHA LOJA PRONTA",
    },
  ],
  calculating: {
    messages: [
      "Analisando suas respostas…",
      "Seu perfil foi aprovado para receber loja pronta!",
      "Cruzando nicho com produtos validados…",
      "Montando identidade visual da sua loja…",
      "Gerando seu diagnóstico personalizado…",
    ],
    messagesByTags: [
      {
        whenTags: ["stage_zero", "blocker_direction"],
        messages: [
          "Selecionando nicho e produtos validados…",
          "Preparando loja com logo e banner…",
          "Liberando sua condição com loja pronta…",
        ],
      },
      {
        whenTags: ["needs_support"],
        messages: [
          "Incluindo acompanhamento ao vivo na sua loja…",
          "Ajustando recomendação com suporte próximo…",
          "Finalizando condição loja + mentoria…",
        ],
      },
      {
        whenTags: ["blocker_trust"],
        messages: [
          "Validando catálogo do nicho escolhido…",
          "Conferindo provas reais de vendas…",
          "Liberando sua condição…",
        ],
      },
      {
        whenTags: ["want_store"],
        messages: [
          "Priorizando loja pronta no seu nicho…",
          "Configurando produtos validados…",
          "Gerando diagnóstico da sua loja…",
        ],
      },
    ],
  },
  result: {
    eyebrow: "SEU DIAGNÓSTICO ESTÁ PRONTO",
    headline: "Sua loja online pode ser montada no nicho ideal — com mentoria pra vender",
    badge: "PERFIL IDEAL",
    highlights: [
      "Loja pronta com produtos validados no nicho que você escolheu",
      "Logo, banner e identidade visual personalizados",
      "Mentoria ao vivo + networking — não é só curso gravado",
      "Condição especial liberada nesta sessão",
    ],
    reassurance:
      "Com base nas suas respostas, liberamos condição com loja pronta nesta sessão — válida enquanto esta página estiver aberta.",
  },
  resultRules: [
    {
      whenTags: ["stage_zero"],
      headline: "Perfil perfeito: loja pronta sem montar nada do zero",
      badge: "ALTO POTENCIAL",
      highlights: [
        "Loja entregue com produtos validados no nicho escolhido",
        "Logo, banner e identidade visual já configurados",
        "Mentoria + calls para colocar no ar e vender",
      ],
      reassurance: "Você não precisa saber montar loja — recebe pronta e segue o passo a passo com suporte.",
    },
    {
      whenTags: ["needs_support"],
      headline: "Loja pronta + suporte ao vivo — sem travar sozinho",
      badge: "PERFIL IDEAL",
      highlights: [
        "Loja entregue — você não monta vitrine na mão",
        "2 calls semanais + WhatsApp para destravar vendas",
        "Networking com lojistas que já estão no programa",
      ],
      reassurance: "Loja pronta pra rodar + acompanhamento real em cada etapa da venda.",
    },
    {
      whenTags: ["goal_transition"],
      headline: "Sua saída do CLT pode começar com loja já estruturada",
      badge: "PERFIL IDEAL",
      highlights: [
        "Loja pronta enquanto você mantém renda atual",
        "Produtos validados + identidade visual profissional",
        "Mentoria e networking na transição",
      ],
      reassurance: "Loja entregue + direcionamento claro para construir renda online com suporte.",
    },
    {
      whenTags: ["goal_scale"],
      headline: "Loja profissional + networking para escalar vendas",
      badge: "ALTO POTENCIAL",
      highlights: [
        "Nova loja estruturada com produtos validados por nicho",
        "Identidade visual forte — logo e banner personalizados",
        "Calls e comunidade para o próximo nível",
      ],
      reassurance: "Vitrine pronta e mentoria para organizar crescimento com consistência.",
    },
    {
      whenTags: ["commit_high"],
      headline: "Você está pronto pra receber sua loja e começar a vender",
      badge: "ALTO POTENCIAL",
      highlights: [
        "Comprometimento confirmado — perfil que mais evolui",
        "Loja pronta + mentoria liberadas nesta sessão",
        "Produtos validados no nicho que você escolheu",
      ],
    },
    {
      whenTags: ["want_branding"],
      headline: "Sua loja com identidade visual do seu jeito — pronta pra rodar",
      badge: "PERFIL IDEAL",
      highlights: [
        "Logo e banner personalizados na sua vitrine",
        "Identidade visual alinhada ao nicho escolhido",
        "Loja configurada — é só colocar no ar",
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
