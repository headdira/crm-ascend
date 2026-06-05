-- Funil insight personalizado (landing /form)

INSERT INTO form_definitions (slug, name, schema, is_active)
VALUES (
  'ascend-ads',
  'Quiz anúncios (Ascend Club)',
  '{
  "version": 1,
  "landing": {
    "eyebrow": "Diagnóstico gratuito · Ascend Club",
    "headline": "Veja se o Ascend Club é o caminho certo para sua renda online",
    "subheadline": "Responda em poucos passos. A cada resposta, mostramos como a mentoria se encaixa no seu momento — sem cartão.",
    "ctaLabel": "QUERO MEU DIAGNÓSTICO",
    "socialProof": "+500 alunos no método Ascend"
  },
  "steps": [
    {
      "id": "objetivo",
      "type": "choice",
      "title": "O que você quer construir com o digital?",
      "hint": "Isso define o foco do seu diagnóstico.",
      "options": [
        {
          "id": "renda_extra",
          "label": "Uma renda extra consistente",
          "subtitle": "Mais tranquilidade financeira",
          "tags": [
            "goal_income"
          ],
          "insight": {
            "eyebrow": "PRIMEIRO MARCO",
            "title": "Renda extra com método — não com tentativa e erro",
            "body": "No Ascend Club você segue um passo a passo pensado para iniciantes, com 2 calls ao vivo por semana para não travar no caminho.",
            "variant": "testimonial",
            "proof": {
              "name": "Lucas F.",
              "role": "Aluno Ascend Club",
              "quote": "Em 3 meses já estava faturando R$2.500/mês. O suporte próximo faz toda a diferença.",
              "imageUrl": "/testimonials/lucas-f.jpg"
            }
          }
        },
        {
          "id": "transicao",
          "label": "Transição do CLT para o online",
          "subtitle": "Mais liberdade e autonomia",
          "tags": [
            "goal_transition"
          ],
          "insight": {
            "eyebrow": "MOVIMENTO ASCEND",
            "title": "Você não precisa fazer essa virada sozinho",
            "body": "O Ascend Club é mentoria + comunidade ativa: networking real, direcionamento e suporte próximo enquanto você constrói sua saída do CLT.",
            "variant": "testimonial",
            "proof": {
              "name": "Mariana C.",
              "role": "Aluna Ascend Club",
              "quote": "Saí do CLT e hoje tenho meu próprio negócio digital. Melhor investimento que já fiz.",
              "imageUrl": "/testimonials/mariana-c.jpg"
            }
          }
        },
        {
          "id": "escala",
          "label": "Escalar o que já comecei",
          "subtitle": "Ir para o próximo nível",
          "tags": [
            "goal_scale"
          ],
          "insight": {
            "eyebrow": "NETWORKING",
            "title": "Escala pede direcionamento e conexões",
            "body": "Além do método, você entra em um grupo de networking exclusivo — onde parcerias e trocas aceleram resultados.",
            "variant": "testimonial",
            "proof": {
              "name": "Rafael O.",
              "role": "Aluno Ascend Club",
              "quote": "Fechei parcerias e meu faturamento triplicou em 6 meses.",
              "imageUrl": "/testimonials/rafael-o.jpg"
            }
          }
        }
      ]
    },
    {
      "id": "situacao",
      "type": "choice",
      "title": "Onde você está hoje no digital?",
      "options": [
        {
          "id": "zero",
          "label": "Ainda não comecei de verdade",
          "tags": [
            "stage_zero"
          ],
          "insight": {
            "eyebrow": "MÉTODO DO ZERO",
            "title": "A mentoria foi criada para quem está começando",
            "body": "Passo a passo claro, linguagem acessível e suporte no WhatsApp. Você não precisa chegar sabendo — precisa chegar disposto a seguir o direcionamento.",
            "variant": "benefit",
            "proof": {
              "statLabel": "+500 alunos aplicando o método"
            }
          }
        },
        {
          "id": "curso_parado",
          "label": "Já consumi conteúdo, mas travei sozinho",
          "tags": [
            "stage_stuck",
            "needs_support"
          ],
          "insight": {
            "eyebrow": "NÃO É CURSO GRAVADO",
            "title": "Aqui você tem acompanhamento de verdade",
            "body": "2 calls ao vivo por semana + suporte próximo. Dúvidas resolvidas na hora — não em módulo gravado que você assiste sem feedback.",
            "variant": "objection",
            "proof": {
              "name": "Pedro H.",
              "role": "Aluno Ascend Club",
              "quote": "Já tentei vários cursos. O Ascend Club é diferente: acompanhamento DE VERDADE.",
              "imageUrl": "/testimonials/pedro-h.jpg"
            }
          }
        },
        {
          "id": "vendendo",
          "label": "Já vendo online e quero estrutura",
          "tags": [
            "stage_selling"
          ],
          "insight": {
            "eyebrow": "PRÓXIMO NÍVEL",
            "title": "Estrutura, calls e comunidade para escalar com consistência",
            "body": "Ferramentas usadas por grandes players, palestrantes convidados e networking ativo — para quem já tem tração e quer organizar o crescimento.",
            "variant": "benefit",
            "proof": {
              "name": "Ana C.",
              "role": "Aluna Ascend Club",
              "quote": "As calls ao vivo são transformadoras. Cada dúvida resolvida na hora.",
              "imageUrl": "/testimonials/ana-c.jpg"
            }
          }
        }
      ]
    },
    {
      "id": "barreira",
      "type": "choice",
      "title": "O que mais te trava hoje?",
      "options": [
        {
          "id": "sem_caminho",
          "label": "Não sei por onde começar",
          "tags": [
            "blocker_direction"
          ],
          "insight": {
            "eyebrow": "DIRECIONAMENTO",
            "title": "Do zero ao resultado — com rota clara",
            "body": "O Ascend Club organiza o caminho em etapas práticas. Você sabe o que fazer agora, e o que vem depois — sem ficar pulando de vídeo em vídeo.",
            "variant": "benefit"
          }
        },
        {
          "id": "sozinho",
          "label": "Me sinto sozinho no processo",
          "tags": [
            "blocker_isolation",
            "needs_support"
          ],
          "insight": {
            "eyebrow": "COMUNIDADE ATIVA",
            "title": "Networking e suporte que mantêm você no jogo",
            "body": "Grupo exclusivo, 2 calls por semana e WhatsApp com o time. Você faz parte de um movimento — não de mais uma plataforma abandonada.",
            "variant": "stat",
            "proof": {
              "statLabel": "2 calls ao vivo · toda semana"
            }
          }
        },
        {
          "id": "desconfianca",
          "label": "Não sei se vai funcionar pra mim",
          "tags": [
            "blocker_trust"
          ],
          "insight": {
            "eyebrow": "PROVA REAL",
            "title": "Método validado em perfis diferentes",
            "body": "Centenas de alunos em situações distintas já aplicaram o método Ascend. Se você participa e segue o direcionamento, o caminho existe.",
            "variant": "objection",
            "proof": {
              "statLabel": "+500 alunos · perfis e contextos diferentes"
            }
          }
        },
        {
          "id": "tempo",
          "label": "Tenho pouco tempo e medo de não acompanhar",
          "tags": [
            "blocker_time",
            "needs_support"
          ],
          "insight": {
            "eyebrow": "RITMO COM SUPORTE",
            "title": "Calls ao vivo para destravar — sem ficar perdido",
            "body": "As aulas em grupo tiram dúvidas na hora e explicam até fixar. Você avança no seu ritmo, mas nunca sem referência.",
            "variant": "benefit",
            "proof": {
              "name": "Kelvin Martins",
              "role": "Co-fundador · Ascend Club",
              "quote": "Traduzimos o que funciona no mercado em passos claros — do primeiro conteúdo à primeira venda."
            }
          }
        }
      ]
    },
    {
      "id": "oferta",
      "type": "offer",
      "title": "Sua vaga no Ascend Club",
      "body": "12 meses de mentoria em grupo, comunidade e suporte próximo. Pagamento único.",
      "priceLabel": "R$60",
      "originalPriceLabel": "R$197",
      "urgencyNote": "Condição liberada só nesta sessão de diagnóstico",
      "priceNote": "Menos de R$0,17 por dia · 1 ano completo",
      "bullets": [
        "Método passo a passo para iniciantes",
        "2 calls ao vivo por semana",
        "Grupo de networking exclusivo",
        "Suporte próximo no WhatsApp",
        "Brindes por progresso no programa"
      ],
      "ctaLabel": "QUERO GARANTIR MINHA VAGA"
    }
  ],
  "calculating": {
    "messages": [
      "Analisando seu perfil…",
      "Cruzando com o método Ascend…",
      "Montando sua recomendação…",
      "Preparando sua condição…"
    ],
    "messagesByTags": [
      {
        "whenTags": [
          "stage_zero",
          "blocker_direction"
        ],
        "messages": [
          "Mapeando seu caminho do zero…",
          "Selecionando o passo a passo ideal…",
          "Preparando sua condição de entrada…"
        ]
      },
      {
        "whenTags": [
          "needs_support"
        ],
        "messages": [
          "Priorizando acompanhamento ao vivo…",
          "Ajustando recomendação com suporte próximo…",
          "Finalizando sua condição…"
        ]
      },
      {
        "whenTags": [
          "blocker_trust"
        ],
        "messages": [
          "Validando fit com o método Ascend…",
          "Conferindo provas do seu perfil…",
          "Liberando sua condição…"
        ]
      }
    ]
  },
  "result": {
    "eyebrow": "SEU DIAGNÓSTICO ESTÁ PRONTO",
    "headline": "O Ascend Club combina com o seu momento",
    "reassurance": "Com base nas suas respostas, liberamos uma condição especial nesta sessão — válida enquanto esta página estiver aberta."
  },
  "resultRules": [
    {
      "whenTags": [
        "stage_zero"
      ],
      "headline": "Você tem perfil para começar do zero com direcionamento claro",
      "reassurance": "O método Ascend foi desenhado para quem ainda não começou — com passo a passo e suporte próximo."
    },
    {
      "whenTags": [
        "needs_support"
      ],
      "headline": "Você precisa de mentoria — não de mais um curso gravado",
      "reassurance": "Calls ao vivo, WhatsApp e comunidade ativa: acompanhamento real durante todo o processo."
    },
    {
      "whenTags": [
        "goal_transition"
      ],
      "headline": "Sua transição para o digital pode ser guiada passo a passo",
      "reassurance": "Mentoria + networking para você construir autonomia sem ficar sozinho na virada."
    },
    {
      "whenTags": [
        "goal_scale"
      ],
      "headline": "Você tem base para escalar com estrutura e networking",
      "reassurance": "Ferramentas, calls e comunidade para organizar o próximo nível do seu negócio digital."
    }
  ],
  "testimonials": [],
  "contact": {
    "nameTitle": "Como posso te chamar?",
    "nameHint": "Só seu primeiro nome — para personalizar seu acesso.",
    "emailTitle": "Qual seu melhor e-mail?",
    "emailHint": "Para liberar seu checkout seguro na Kiwify.",
    "phoneTitle": "Seu WhatsApp",
    "phoneHint": "Usamos só para suporte do programa. Em seguida você vai para o pagamento.",
    "submitLabel": "LIBERAR MEU ACESSO"
  }
}'::jsonb,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  schema = EXCLUDED.schema,
  is_active = EXCLUDED.is_active;
