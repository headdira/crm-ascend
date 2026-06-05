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
    eyebrow: "Diagnóstico gratuito · Ascend Club",
    headline: "Descubra se o Ascend Club é o caminho certo pra sua renda online",
    subheadline:
      "Responda 4 perguntas rápidas e receba uma recomendação personalizada — sem cartão, sem compromisso.",
    ctaLabel: "QUERO MEU DIAGNÓSTICO",
    socialProof: "+500 alunos já aplicando o método Ascend",
  },
  steps: [
    {
      id: "objetivo",
      type: "choice",
      title: "Qual é o seu principal objetivo?",
      hint: "Isso ajuda a personalizar sua experiência no programa.",
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
      id: "proof",
      type: "message",
      title: "Você está no lugar certo",
      body:
        "O Ascend Club foi criado para quem quer direcionamento claro: passo a passo, 2 calls ao vivo por semana, networking e suporte de verdade — sem ficar sozinho no processo.",
      ctaLabel: "VER MINHA RECOMENDAÇÃO",
    },
    {
      id: "oferta",
      type: "offer",
      title: "Sua vaga no Ascend Club",
      body: "Pagamento único. 12 meses de acesso completo à mentoria e comunidade.",
      priceLabel: "R$197",
      priceNote: "Menos de R$0,54 por dia",
      bullets: [
        "Método para iniciantes",
        "2 calls ao vivo por semana",
        "Grupo de networking exclusivo",
        "Suporte próximo no WhatsApp",
      ],
      ctaLabel: "QUERO GARANTIR MINHA VAGA",
    },
  ],
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
