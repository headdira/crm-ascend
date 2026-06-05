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
      "Descubra se o Ascend Club é o próximo passo para construir sua renda online com mentoria ao vivo",
    subheadline:
      "Responda em poucos minutos. A cada resposta, mostramos como o método — calls, networking e suporte próximo — se encaixa no seu momento. Sem cartão.",
    ctaLabel: "COMEÇAR MEU DIAGNÓSTICO",
    socialProof: "⚡ Mais de 500 alunos já aplicam o método Ascend",
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
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[0],
              imageCaption: "Print real de aluno no Ascend Club",
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
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[1],
              imageCaption: "Print real — resultado no digital",
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
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[2],
              imageCaption: "Print real — escala no método Ascend",
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
            eyebrow: "SEU MOMENTO",
            title: "Mais resultado começa com direcionamento — não com mais esforço cego",
            body: "No Ascend Club você para de tentar sozinho e segue um método com calls ao vivo para aplicar no ritmo certo.",
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
            eyebrow: "PRÓXIMO NÍVEL",
            title: "Renda online como complemento — com estrutura",
            body: "Mentoria em grupo, networking e passo a passo para construir renda extra sem largar tudo de uma vez.",
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
      title: "Você não precisa ser a maioria",
      variant: "story",
      body: "A maioria reclama que o digital não funciona — mas tenta sozinha, sem mentoria, sem networking e sem alguém destravando na hora.\n\nO Ascend Club existe para quem quer sair desse ciclo: método claro, 2 calls ao vivo por semana, comunidade ativa e suporte próximo no WhatsApp.\n\nSe nada mudar nos próximos 12 meses, você vai estar no mesmo lugar — ou mais cansado. A diferença é ter um caminho guiado.",
      ctaLabel: "CONTINUAR MINHA ANÁLISE",
    },
    {
      id: "prova_dinamica",
      type: "dynamic",
      title: "Isso é para pessoas como você",
      body: "Mais de 500 alunos já aplicam o método Ascend com mentoria ao vivo e networking real.\n\nCom base no que você busca — {{objetivo}} — e no seu momento atual — {{momento}} — o programa foi desenhado para dar direcionamento claro, calls semanais e suporte próximo.\n\nContinue respondendo para receber seu diagnóstico personalizado 👇",
      ctaLabel: "Continuar minha análise",
      imageUrl: QUIZ_PROOF_IMAGES[5],
    },
    {
      id: "mecanismo",
      type: "mechanism",
      title: "Como o Ascend Club te leva do zero ao resultado",
      intro: "Mentoria + comunidade + suporte próximo — no seu ritmo, sem ficar sozinho.",
      mechanismSteps: [
        {
          title: "Seguir o método passo a passo",
          subtitle: "Do primeiro passo à primeira venda — linguagem clara para iniciantes",
        },
        {
          title: "Participar das 2 calls ao vivo por semana",
          subtitle: "Dúvidas resolvidas na hora, com direcionamento do time",
          highlight: "Suporte real",
        },
        {
          title: "Entrar no networking exclusivo",
          subtitle: "Conexões, trocas e parcerias que aceleram sua evolução",
          highlight: "+500 alunos",
        },
      ],
      bullets: [
        "Sem precisar aparecer ou gravar conteúdo complexo",
        "Começo acessível — menos de R$0,17 por dia no plano anual",
        "Comunidade ativa, não plataforma abandonada",
      ],
      ctaLabel: "QUERO SEGUIR O MÉTODO",
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
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[3],
              imageCaption: "Print real — começando do zero",
            },
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
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[4],
              imageCaption: "Print real — acompanhamento no programa",
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
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[6],
              imageCaption: "Print real — passo a passo aplicado",
            },
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
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[7],
              imageCaption: "Print real — comunidade Ascend Club",
            },
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
            variant: "print",
            proof: {
              imageUrl: QUIZ_PROOF_IMAGES[8],
              imageCaption: "Print real de resultado — mesmos da landing",
            },
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
      title: "O que seria mais importante pra você em uma mentoria?",
      hint: "Escolha até 3 opções que mais combinam com você:",
      minSelect: 2,
      maxSelect: 3,
      ctaLabel: "Continuar",
      options: [
        {
          id: "flexibilidade",
          label: "Trabalhar de qualquer lugar, no meu ritmo",
          tags: ["want_flexibility"],
        },
        {
          id: "suporte",
          label: "Ter suporte ao vivo quando travar",
          tags: ["needs_support"],
        },
        {
          id: "networking",
          label: "Networking e conexões com outros alunos",
          tags: ["want_networking"],
        },
        {
          id: "metodo",
          label: "Passo a passo claro do zero",
          tags: ["blocker_direction", "stage_zero"],
        },
        {
          id: "tempo_familia",
          label: "Mais tempo para família e lazer",
          tags: ["want_lifestyle"],
        },
        {
          id: "renda",
          label: "Renda extra consistente",
          tags: ["goal_income"],
        },
      ],
    },
    {
      id: "compromisso",
      type: "choice",
      title: "Você começaria com mentoria + calls + networking assim?",
      options: [
        {
          id: "sim_agora",
          label: "Com certeza! Preciso disso 🔥",
          tags: ["commit_high"],
        },
        {
          id: "sim_logo",
          label: "Sim, quero começar logo 🏃",
          tags: ["commit_high"],
        },
      ],
    },
    {
      id: "autoridade",
      type: "message",
      title: "Quem está por trás do seu diagnóstico?",
      variant: "authority",
      imageUrl: "/media/mentor-kelvin.jpeg",
      body: "Prazer — somos Kelvin Martins e Erick Vinicius, co-fundadores do Ascend Club.\n\nJá ajudamos centenas de alunos a construírem suas primeiras fontes de renda online com estratégias simples, calls ao vivo e suporte próximo.\n\nNo Ascend Club você não compra mais um curso gravado: entra em uma mentoria em grupo com networking real e acompanhamento durante todo o processo.",
      ctaLabel: "GERAR MEU DIAGNÓSTICO",
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
      "Analisando suas respostas…",
      "Seu perfil foi aprovado para o diagnóstico Ascend!",
      "Cruzando com alunos no mesmo momento…",
      "Calculando seu encaixe com a mentoria…",
      "Gerando sua condição personalizada…",
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
    badge: "PERFIL IDEAL",
    highlights: [
      "Comprometimento real com mudança — raro entre quem responde",
      "Encaixe com mentoria ao vivo + networking, não curso gravado",
      "Condição especial liberada nesta sessão de diagnóstico",
    ],
    reassurance:
      "Com base nas suas respostas, liberamos uma condição especial nesta sessão — válida enquanto esta página estiver aberta.",
  },
  resultRules: [
    {
      whenTags: ["stage_zero"],
      headline: "Você tem perfil para começar do zero com direcionamento claro",
      badge: "ALTO POTENCIAL",
      highlights: [
        "Perfil iniciante — método desenhado para quem ainda não começou",
        "Passo a passo + calls ao vivo para não travar sozinho",
        "Suporte próximo no WhatsApp durante o programa",
      ],
      reassurance: "O método Ascend foi desenhado para quem ainda não começou — com passo a passo e suporte próximo.",
    },
    {
      whenTags: ["needs_support"],
      headline: "Você precisa de mentoria — não de mais um curso gravado",
      badge: "PERFIL IDEAL",
      highlights: [
        "Prioridade: acompanhamento ao vivo nas 2 calls semanais",
        "Comunidade ativa para não ficar sozinho no processo",
        "Destrave rápido com suporte do time",
      ],
      reassurance: "Calls ao vivo, WhatsApp e comunidade ativa: acompanhamento real durante todo o processo.",
    },
    {
      whenTags: ["goal_transition"],
      headline: "Sua transição para o digital pode ser guiada passo a passo",
      badge: "PERFIL IDEAL",
      highlights: [
        "Networking para construir autonomia sem virada solitária",
        "Mentoria enquanto você mantém renda atual",
        "Direcionamento claro em cada etapa da transição",
      ],
      reassurance: "Mentoria + networking para você construir autonomia sem ficar sozinho na virada.",
    },
    {
      whenTags: ["goal_scale"],
      headline: "Você tem base para escalar com estrutura e networking",
      badge: "ALTO POTENCIAL",
      highlights: [
        "Estrutura para organizar o que já começou",
        "Networking para parcerias e próximo nível",
        "Calls e ferramentas usadas por quem já vende online",
      ],
      reassurance: "Ferramentas, calls e comunidade para organizar o próximo nível do seu negócio digital.",
    },
    {
      whenTags: ["commit_high"],
      headline: "Você demonstrou compromisso — perfil que mais evolui no Ascend",
      badge: "ALTO POTENCIAL",
      highlights: [
        "Comprometimento real com a mudança",
        "Pronto para seguir método + calls + comunidade",
        "Condição especial liberada agora",
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
