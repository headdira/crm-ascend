import { z } from "zod";

export const ADS_QUIZ_SLUG = "ascend-ads" as const;

export const quizInsightVariantSchema = z.enum([
  "default",
  "testimonial",
  "objection",
  "benefit",
  "stat",
  "mentor",
]);

export const quizInsightProofSchema = z.object({
  name: z.string().max(80).optional(),
  role: z.string().max(120).optional(),
  quote: z.string().max(400).optional(),
  imageUrl: z.string().max(500).optional(),
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
  steps: z.array(quizStepSchema).min(1).max(16),
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
    })
    .optional(),
  resultRules: z
    .array(
      tagRuleSchema.extend({
        headline: z.string().min(1).max(400),
        reassurance: z.string().max(600).optional(),
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

export function collectProfileTags(
  questionSteps: AdsQuizStep[],
  answers: Record<string, string>,
): string[] {
  const tags = new Set<string>();
  for (const step of questionSteps) {
    if (step.type !== "choice") continue;
    const optionId = answers[step.id];
    if (!optionId) continue;
    const opt = step.options.find((o) => o.id === optionId);
    opt?.tags?.forEach((t) => tags.add(t));
  }
  return [...tags];
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
  };
}

export const DEFAULT_ADS_QUIZ_CONFIG: AdsQuizConfig = {
  version: 1,
  landing: {
    eyebrow: "Diagnóstico gratuito · Ascend Club",
    headline: "Veja se o Ascend Club é o caminho certo para sua renda online",
    subheadline:
      "Responda em poucos passos. A cada resposta, mostramos como a mentoria se encaixa no seu momento — sem cartão.",
    ctaLabel: "QUERO MEU DIAGNÓSTICO",
    socialProof: "+500 alunos no método Ascend",
  },
  steps: [
    {
      id: "objetivo",
      type: "choice",
      title: "O que você quer construir com o digital?",
      hint: "Isso define o foco do seu diagnóstico.",
      options: [
        {
          id: "renda_extra",
          label: "Uma renda extra consistente",
          subtitle: "Mais tranquilidade financeira",
          tags: ["goal_income"],
          insight: {
            eyebrow: "PRIMEIRO MARCO",
            title: "Renda extra com método — não com tentativa e erro",
            body: "No Ascend Club você segue um passo a passo pensado para iniciantes, com 2 calls ao vivo por semana para não travar no caminho.",
            variant: "testimonial",
            proof: {
              name: "Lucas F.",
              role: "Aluno Ascend Club",
              quote: "Em 3 meses já estava faturando R$2.500/mês. O suporte próximo faz toda a diferença.",
              imageUrl: "/testimonials/lucas-f.jpg",
            },
          },
        },
        {
          id: "transicao",
          label: "Transição do CLT para o online",
          subtitle: "Mais liberdade e autonomia",
          tags: ["goal_transition"],
          insight: {
            eyebrow: "MOVIMENTO ASCEND",
            title: "Você não precisa fazer essa virada sozinho",
            body: "O Ascend Club é mentoria + comunidade ativa: networking real, direcionamento e suporte próximo enquanto você constrói sua saída do CLT.",
            variant: "testimonial",
            proof: {
              name: "Mariana C.",
              role: "Aluna Ascend Club",
              quote: "Saí do CLT e hoje tenho meu próprio negócio digital. Melhor investimento que já fiz.",
              imageUrl: "/testimonials/mariana-c.jpg",
            },
          },
        },
        {
          id: "escala",
          label: "Escalar o que já comecei",
          subtitle: "Ir para o próximo nível",
          tags: ["goal_scale"],
          insight: {
            eyebrow: "NETWORKING",
            title: "Escala pede direcionamento e conexões",
            body: "Além do método, você entra em um grupo de networking exclusivo — onde parcerias e trocas aceleram resultados.",
            variant: "testimonial",
            proof: {
              name: "Rafael O.",
              role: "Aluno Ascend Club",
              quote: "Fechei parcerias e meu faturamento triplicou em 6 meses.",
              imageUrl: "/testimonials/rafael-o.jpg",
            },
          },
        },
      ],
    },
    {
      id: "situacao",
      type: "choice",
      title: "Onde você está hoje no digital?",
      options: [
        {
          id: "zero",
          label: "Ainda não comecei de verdade",
          tags: ["stage_zero"],
          insight: {
            eyebrow: "MÉTODO DO ZERO",
            title: "A mentoria foi criada para quem está começando",
            body: "Passo a passo claro, linguagem acessível e suporte no WhatsApp. Você não precisa chegar sabendo — precisa chegar disposto a seguir o direcionamento.",
            variant: "benefit",
            proof: { statLabel: "+500 alunos aplicando o método" },
          },
        },
        {
          id: "curso_parado",
          label: "Já consumi conteúdo, mas travei sozinho",
          tags: ["stage_stuck", "needs_support"],
          insight: {
            eyebrow: "NÃO É CURSO GRAVADO",
            title: "Aqui você tem acompanhamento de verdade",
            body: "2 calls ao vivo por semana + suporte próximo. Dúvidas resolvidas na hora — não em módulo gravado que você assiste sem feedback.",
            variant: "objection",
            proof: {
              name: "Pedro H.",
              role: "Aluno Ascend Club",
              quote: "Já tentei vários cursos. O Ascend Club é diferente: acompanhamento DE VERDADE.",
              imageUrl: "/testimonials/pedro-h.jpg",
            },
          },
        },
        {
          id: "vendendo",
          label: "Já vendo online e quero estrutura",
          tags: ["stage_selling"],
          insight: {
            eyebrow: "PRÓXIMO NÍVEL",
            title: "Estrutura, calls e comunidade para escalar com consistência",
            body: "Ferramentas usadas por grandes players, palestrantes convidados e networking ativo — para quem já tem tração e quer organizar o crescimento.",
            variant: "benefit",
            proof: {
              name: "Ana C.",
              role: "Aluna Ascend Club",
              quote: "As calls ao vivo são transformadoras. Cada dúvida resolvida na hora.",
              imageUrl: "/testimonials/ana-c.jpg",
            },
          },
        },
      ],
    },
    {
      id: "barreira",
      type: "choice",
      title: "O que mais te trava hoje?",
      options: [
        {
          id: "sem_caminho",
          label: "Não sei por onde começar",
          tags: ["blocker_direction"],
          insight: {
            eyebrow: "DIRECIONAMENTO",
            title: "Do zero ao resultado — com rota clara",
            body: "O Ascend Club organiza o caminho em etapas práticas. Você sabe o que fazer agora, e o que vem depois — sem ficar pulando de vídeo em vídeo.",
            variant: "benefit",
          },
        },
        {
          id: "sozinho",
          label: "Me sinto sozinho no processo",
          tags: ["blocker_isolation", "needs_support"],
          insight: {
            eyebrow: "COMUNIDADE ATIVA",
            title: "Networking e suporte que mantêm você no jogo",
            body: "Grupo exclusivo, 2 calls por semana e WhatsApp com o time. Você faz parte de um movimento — não de mais uma plataforma abandonada.",
            variant: "stat",
            proof: { statLabel: "2 calls ao vivo · toda semana" },
          },
        },
        {
          id: "desconfianca",
          label: "Não sei se vai funcionar pra mim",
          tags: ["blocker_trust"],
          insight: {
            eyebrow: "PROVA REAL",
            title: "Método validado em perfis diferentes",
            body: "Centenas de alunos em situações distintas já aplicaram o método Ascend. Se você participa e segue o direcionamento, o caminho existe.",
            variant: "objection",
            proof: { statLabel: "+500 alunos · perfis e contextos diferentes" },
          },
        },
        {
          id: "tempo",
          label: "Tenho pouco tempo e medo de não acompanhar",
          tags: ["blocker_time", "needs_support"],
          insight: {
            eyebrow: "RITMO COM SUPORTE",
            title: "Calls ao vivo para destravar — sem ficar perdido",
            body: "As aulas em grupo tiram dúvidas na hora e explicam até fixar. Você avança no seu ritmo, mas nunca sem referência.",
            variant: "benefit",
            proof: {
              name: "Kelvin Martins",
              role: "Co-fundador · Ascend Club",
              quote: "Traduzimos o que funciona no mercado em passos claros — do primeiro conteúdo à primeira venda.",
            },
          },
        },
      ],
    },
    {
      id: "oferta",
      type: "offer",
      title: "Sua vaga no Ascend Club",
      body: "12 meses de mentoria em grupo, comunidade e suporte próximo. Pagamento único.",
      priceLabel: "R$60",
      originalPriceLabel: "R$197",
      urgencyNote: "Condição liberada só nesta sessão de diagnóstico",
      priceNote: "Menos de R$0,17 por dia · 1 ano completo",
      bullets: [
        "Método passo a passo para iniciantes",
        "2 calls ao vivo por semana",
        "Grupo de networking exclusivo",
        "Suporte próximo no WhatsApp",
        "Brindes por progresso no programa",
      ],
      ctaLabel: "QUERO GARANTIR MINHA VAGA",
    },
  ],
  calculating: {
    messages: [
      "Analisando seu perfil…",
      "Cruzando com o método Ascend…",
      "Montando sua recomendação…",
      "Preparando sua condição…",
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
    eyebrow: "SEU DIAGNÓSTICO ESTÁ PRONTO",
    headline: "O Ascend Club combina com o seu momento",
    reassurance:
      "Com base nas suas respostas, liberamos uma condição especial nesta sessão — válida enquanto esta página estiver aberta.",
  },
  resultRules: [
    {
      whenTags: ["stage_zero"],
      headline: "Você tem perfil para começar do zero com direcionamento claro",
      reassurance: "O método Ascend foi desenhado para quem ainda não começou — com passo a passo e suporte próximo.",
    },
    {
      whenTags: ["needs_support"],
      headline: "Você precisa de mentoria — não de mais um curso gravado",
      reassurance: "Calls ao vivo, WhatsApp e comunidade ativa: acompanhamento real durante todo o processo.",
    },
    {
      whenTags: ["goal_transition"],
      headline: "Sua transição para o digital pode ser guiada passo a passo",
      reassurance: "Mentoria + networking para você construir autonomia sem ficar sozinho na virada.",
    },
    {
      whenTags: ["goal_scale"],
      headline: "Você tem base para escalar com estrutura e networking",
      reassurance: "Ferramentas, calls e comunidade para organizar o próximo nível do seu negócio digital.",
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
