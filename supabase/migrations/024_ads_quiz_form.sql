-- Quiz de anúncios (landing /form) — config editável no CRM via form_definitions

INSERT INTO form_definitions (slug, name, schema, is_active)
VALUES (
  'ascend-ads',
  'Quiz anúncios (Ascend Club)',
  '{
    "version": 1,
    "landing": {
      "eyebrow": "Ascend Club · diagnóstico rápido",
      "headline": "Veja se o Ascend Club é o próximo passo para construir sua renda online",
      "subheadline": "Menos de 2 minutos. Mentoria em grupo, suporte próximo e método validado — mesmo começando do zero.",
      "ctaLabel": "COMEÇAR",
      "socialProof": "Mais de 500 alunos aplicando o método Ascend"
    },
    "steps": [
      {
        "id": "objetivo",
        "type": "choice",
        "title": "Qual é o seu principal objetivo?",
        "hint": "Isso ajuda a personalizar sua experiência no programa.",
        "options": [
          {"id": "renda_extra", "label": "Ganhar uma renda extra", "subtitle": "Mais tranquilidade financeira"},
          {"id": "sair_clt", "label": "Sair do CLT e trabalhar online", "subtitle": "Mais liberdade e flexibilidade"},
          {"id": "liberdade", "label": "Alcançar liberdade financeira", "subtitle": "Construir algo meu no digital"}
        ]
      },
      {
        "id": "experiencia",
        "type": "choice",
        "title": "Qual sua experiência com o digital?",
        "options": [
          {"id": "iniciante", "label": "Estou começando do zero"},
          {"id": "tentei", "label": "Já tentei, mas não tive resultado"},
          {"id": "vendo", "label": "Já vendo online e quero escalar"}
        ]
      },
      {
        "id": "proof",
        "type": "message",
        "title": "Você está no lugar certo",
        "body": "O Ascend Club foi criado para quem quer direcionamento claro: passo a passo, 2 calls ao vivo por semana, networking e suporte de verdade — sem ficar sozinho no processo.",
        "ctaLabel": "Continuar"
      },
      {
        "id": "oferta",
        "type": "offer",
        "title": "Sua vaga no Ascend Club",
        "body": "Pagamento único. 12 meses de acesso completo à mentoria e comunidade.",
        "priceLabel": "R$197",
        "priceNote": "Menos de R$0,54 por dia",
        "bullets": [
          "Método para iniciantes",
          "2 calls ao vivo por semana",
          "Grupo de networking exclusivo",
          "Suporte próximo no WhatsApp"
        ],
        "ctaLabel": "Quero entrar no Ascend Club"
      }
    ],
    "contact": {
      "nameTitle": "Como podemos te chamar?",
      "nameHint": "Só seu primeiro nome.",
      "emailTitle": "Seu melhor e-mail",
      "emailHint": "Para liberar seu acesso ao checkout seguro.",
      "phoneTitle": "Seu WhatsApp",
      "phoneHint": "Usamos só para suporte do programa.",
      "submitLabel": "Ir para pagamento"
    }
  }'::jsonb,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  schema = EXCLUDED.schema,
  is_active = EXCLUDED.is_active;
