-- Funil black /form — config completa com calculating, result e oferta R$60

INSERT INTO form_definitions (slug, name, schema, is_active)
VALUES (
  'ascend-ads',
  'Quiz anúncios (Ascend Club)',
  '{
    "version": 1,
    "landing": {
      "eyebrow": "Diagnóstico exclusivo · Ascend Club",
      "headline": "Descubra quanto você pode faturar nos próximos 90 dias com o método Ascend",
      "subheadline": "3 perguntas rápidas. Diagnóstico personalizado. Sem cartão, sem compromisso.",
      "ctaLabel": "QUERO MEU DIAGNÓSTICO GRÁTIS",
      "socialProof": "+500 alunos já aplicando o método Ascend"
    },
    "steps": [
      {
        "id": "objetivo",
        "type": "choice",
        "title": "Qual é o seu principal objetivo hoje?",
        "hint": "Isso define o caminho do seu diagnóstico.",
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
        "id": "faturamento",
        "type": "choice",
        "title": "Qual sua meta de faturamento nos próximos 90 dias?",
        "options": [
          {"id": "ate_3k", "label": "Até R$3.000/mês", "subtitle": "Primeira renda consistente"},
          {"id": "3k_10k", "label": "R$3.000 a R$10.000/mês", "subtitle": "Escalar o que já comecei"},
          {"id": "10k_plus", "label": "Acima de R$10.000/mês", "subtitle": "Ir para o próximo nível"}
        ]
      },
      {
        "id": "oferta",
        "type": "offer",
        "title": "Sua vaga no Ascend Club",
        "body": "Pagamento único. 12 meses de acesso completo à mentoria e comunidade.",
        "priceLabel": "R$60",
        "originalPriceLabel": "R$197",
        "urgencyNote": "Lote promocional: apenas 47 vagas com esse valor",
        "priceNote": "Menos de R$0,17 por dia",
        "bullets": [
          "Método para iniciantes",
          "2 calls ao vivo por semana",
          "Grupo de networking exclusivo",
          "Suporte próximo no WhatsApp"
        ],
        "ctaLabel": "QUERO GARANTIR MINHA VAGA"
      }
    ],
    "calculating": {
      "messages": [
        "Analisando suas respostas…",
        "Cruzando com o método Ascend…",
        "Calculando seu potencial de faturamento…",
        "Preparando sua oferta exclusiva…"
      ]
    },
    "result": {
      "eyebrow": "SEU DIAGNÓSTICO ESTÁ PRONTO",
      "headline": "Você tem perfil para escalar com o Ascend Club",
      "reassurance": "Com base nas suas respostas, liberamos uma condição especial por tempo limitado — válida só nesta sessão."
    },
    "testimonials": [],
    "contact": {
      "nameTitle": "Como posso te chamar?",
      "nameHint": "Só seu primeiro nome — para personalizar seu acesso.",
      "emailTitle": "Qual seu melhor e-mail?",
      "emailHint": "Vou usar para liberar seu checkout seguro na Kiwify.",
      "phoneTitle": "Seu WhatsApp",
      "phoneHint": "Só para suporte do programa. Em seguida você vai para o pagamento.",
      "submitLabel": "LIBERAR MEU ACESSO"
    }
  }'::jsonb,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  schema = EXCLUDED.schema,
  is_active = EXCLUDED.is_active;
