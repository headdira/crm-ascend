import { z } from "zod";

export const ADS_QUIZ_SLUG = "ascend-ads" as const;

const quizOptionSchema = z.object({
  id: z.string().min(1).max(40),
  label: z.string().min(1).max(200),
  subtitle: z.string().max(300).optional(),
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
  steps: z.array(quizStepSchema).min(1).max(12),
  calculating: z
    .object({
      messages: z.array(z.string().min(1).max(120)).min(1).max(6),
    })
    .optional(),
  result: z
    .object({
      eyebrow: z.string().min(1).max(120),
      headline: z.string().min(1).max(400),
      reassurance: z.string().max(600).optional(),
    })
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

export const DEFAULT_ADS_QUIZ_CONFIG: AdsQuizConfig = {
  version: 1,
  landing: {
    eyebrow: "Diagnóstico exclusivo · Ascend Club",
    headline: "Descubra quanto você pode faturar nos próximos 90 dias com o método Ascend",
    subheadline:
      "3 perguntas rápidas. Diagnóstico personalizado. Sem cartão, sem compromisso.",
    ctaLabel: "QUERO MEU DIAGNÓSTICO GRÁTIS",
    socialProof: "+500 alunos já aplicando o método Ascend",
  },
  steps: [
    {
      id: "objetivo",
      type: "choice",
      title: "Qual é o seu principal objetivo hoje?",
      hint: "Isso define o caminho do seu diagnóstico.",
      options: [
        { id: "renda_extra", label: "Ganhar uma renda extra", subtitle: "Mais tranquilidade financeira" },
        {
          id: "sair_clt",
          label: "Sair do CLT e trabalhar online",
          subtitle: "Mais liberdade e flexibilidade",
        },
        {
          id: "liberdade",
          label: "Alcançar liberdade financeira",
          subtitle: "Construir algo meu no digital",
        },
      ],
    },
    {
      id: "experiencia",
      type: "choice",
      title: "Qual sua experiência com o digital?",
      options: [
        { id: "iniciante", label: "Estou começando do zero" },
        { id: "tentei", label: "Já tentei, mas não tive resultado" },
        { id: "vendo", label: "Já vendo online e quero escalar" },
      ],
    },
    {
      id: "faturamento",
      type: "choice",
      title: "Qual sua meta de faturamento nos próximos 90 dias?",
      options: [
        { id: "ate_3k", label: "Até R$3.000/mês", subtitle: "Primeira renda consistente" },
        { id: "3k_10k", label: "R$3.000 a R$10.000/mês", subtitle: "Escalar o que já comecei" },
        { id: "10k_plus", label: "Acima de R$10.000/mês", subtitle: "Ir para o próximo nível" },
      ],
    },
    {
      id: "oferta",
      type: "offer",
      title: "Sua vaga no Ascend Club",
      body: "Pagamento único. 12 meses de acesso completo à mentoria e comunidade.",
      priceLabel: "R$60",
      originalPriceLabel: "R$197",
      urgencyNote: "Lote promocional: apenas 47 vagas com esse valor",
      priceNote: "Menos de R$0,17 por dia",
      bullets: [
        "Método para iniciantes",
        "2 calls ao vivo por semana",
        "Grupo de networking exclusivo",
        "Suporte próximo no WhatsApp",
      ],
      ctaLabel: "QUERO GARANTIR MINHA VAGA",
    },
  ],
  calculating: {
    messages: [
      "Analisando suas respostas…",
      "Cruzando com o método Ascend…",
      "Calculando seu potencial de faturamento…",
      "Preparando sua oferta exclusiva…",
    ],
  },
  result: {
    eyebrow: "SEU DIAGNÓSTICO ESTÁ PRONTO",
    headline: "Você tem perfil para escalar com o Ascend Club",
    reassurance:
      "Com base nas suas respostas, liberamos uma condição especial por tempo limitado — válida só nesta sessão.",
  },
  testimonials: [],
  contact: {
    nameTitle: "Como posso te chamar?",
    nameHint: "Só seu primeiro nome — para personalizar seu acesso.",
    emailTitle: "Qual seu melhor e-mail?",
    emailHint: "Vou usar para liberar seu checkout seguro na Kiwify.",
    phoneTitle: "Seu WhatsApp",
    phoneHint: "Só para suporte do programa. Em seguida você vai para o pagamento.",
    submitLabel: "LIBERAR MEU ACESSO",
  },
};

export const adsQuizConfigUpdateSchema = adsQuizConfigSchema;

/** Config legada (sem campos novos) — usada em testes de retrocompatibilidade. */
export const LEGACY_ADS_QUIZ_CONFIG = {
  version: 1 as const,
  landing: DEFAULT_ADS_QUIZ_CONFIG.landing,
  steps: DEFAULT_ADS_QUIZ_CONFIG.steps.map((s) => {
    if (s.type !== "offer") return s;
    const { originalPriceLabel: _o, urgencyNote: _u, ...rest } = s;
    return rest;
  }),
  contact: DEFAULT_ADS_QUIZ_CONFIG.contact,
};
