-- Loja pronta como diferencial, mentoria como proposta principal

INSERT INTO form_definitions (slug, name, schema, is_active)
VALUES (
  'ascend-ads',
  'Quiz anúncios (Ascend Club)',
  '{
  "version": 1,
  "landing": {
    "eyebrow": "Diagnóstico gratuito · Ascend Club",
    "headline": "Descubra se o Ascend Club é o próximo passo para construir sua renda online com mentoria ao vivo",
    "subheadline": "Responda em poucos minutos. A cada resposta, mostramos como o método — calls, networking e suporte próximo — se encaixa no seu momento. Você também recebe loja online pronta, com produtos validados por nicho, logo, banner e identidade visual. Sem cartão.",
    "ctaLabel": "COMEÇAR MEU DIAGNÓSTICO",
    "socialProof": "⚡ Mais de 500 alunos já aplicam o método Ascend"
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
            "variant": "print",
            "proof": {
              "imageUrl": "/media/proof/proof-01.jpeg",
              "imageCaption": "Print real de aluno no Ascend Club"
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
            "variant": "print",
            "proof": {
              "imageUrl": "/media/proof/proof-02.jpg",
              "imageCaption": "Print real — resultado no digital"
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
            "variant": "print",
            "proof": {
              "imageUrl": "/media/proof/proof-03.jpeg",
              "imageCaption": "Print real — escala no método Ascend"
            }
          }
        }
      ]
    },
    {
      "id": "momento",
      "type": "choice",
      "title": "Qual frase melhor descreve sua situação hoje?",
      "hint": "Seja honesto — isso personaliza seu diagnóstico.",
      "options": [
        {
          "id": "esforco_pouco",
          "label": "Trabalho muito e ganho pouco pro tanto que me esforço",
          "subtitle": "Quero mais retorno pelo meu tempo",
          "tags": [
            "pain_underpaid"
          ],
          "insight": {
            "eyebrow": "SEU MOMENTO",
            "title": "Mais resultado começa com direcionamento — não com mais esforço cego",
            "body": "No Ascend Club você para de tentar sozinho e segue um método com calls ao vivo para aplicar no ritmo certo.",
            "variant": "print",
            "proof": {
              "imageUrl": "/media/proof/proof-04.jpeg",
              "imageCaption": "Print real — evolução com método"
            }
          }
        },
        {
          "id": "pode_mais",
          "label": "Tenho um trabalho ok, mas sei que posso mais",
          "subtitle": "Quero uma segunda fonte de renda",
          "tags": [
            "pain_ok_job"
          ],
          "insight": {
            "eyebrow": "PRÓXIMO NÍVEL",
            "title": "Renda online como complemento — com estrutura",
            "body": "Mentoria em grupo, networking e passo a passo para construir renda extra sem largar tudo de uma vez.",
            "variant": "print",
            "proof": {
              "imageUrl": "/media/proof/proof-05.jpeg",
              "imageCaption": "Print real — renda extra no programa"
            }
          }
        },
        {
          "id": "estudante",
          "label": "Estou estudando e quero começar a ganhar meu dinheiro",
          "subtitle": "Construir enquanto aprende",
          "tags": [
            "pain_student",
            "stage_zero"
          ]
        },
        {
          "id": "sem_renda",
          "label": "Estou sem renda fixa e preciso resolver isso",
          "subtitle": "Urgência real",
          "tags": [
            "pain_no_income",
            "needs_support"
          ]
        },
        {
          "id": "empreendo",
          "label": "Já empreendo, mas quero uma nova fonte de receita",
          "subtitle": "Diversificar com digital",
          "tags": [
            "pain_entrepreneur",
            "goal_scale"
          ]
        }
      ]
    },
    {
      "id": "historia",
      "type": "message",
      "title": "Você não precisa ser a maioria",
      "variant": "story",
      "body": "A maioria reclama que o digital não funciona — mas tenta sozinha, sem mentoria, sem networking e sem alguém destravando na hora.\n\nO Ascend Club existe para quem quer sair desse ciclo: método claro, 2 calls ao vivo por semana, comunidade ativa e suporte próximo no WhatsApp — e ainda recebe loja online pronta com produtos validados, logo, banner e identidade visual no nicho que escolher.\n\nSe nada mudar nos próximos 12 meses, você vai estar no mesmo lugar — ou mais cansado. A diferença é ter um caminho guiado.",
      "ctaLabel": "CONTINUAR MINHA ANÁLISE"
    },
    {
      "id": "mecanismo",
      "type": "mechanism",
      "title": "Como o Ascend Club te leva do zero ao resultado",
      "intro": "Loja pronta no nicho que você escolher + mentoria ao vivo para colocar no ar e vender.",
      "mechanismSteps": [
        {
          "title": "Receber sua loja online pronta",
          "subtitle": "Produtos validados por nicho, logo, banner e identidade visual do seu jeito — pronta pra rodar",
          "highlight": "Loja entregue"
        },
        {
          "title": "Seguir o método e participar das 2 calls ao vivo",
          "subtitle": "Do primeiro passo à primeira venda — dúvidas resolvidas na hora com o time",
          "highlight": "Suporte real"
        },
        {
          "title": "Entrar no networking exclusivo",
          "subtitle": "Conexões, trocas e parcerias que aceleram sua evolução",
          "highlight": "+500 alunos"
        }
      ],
      "bullets": [
        "Loja pronta com produtos validados — sem montar tudo do zero",
        "Sem precisar aparecer ou gravar conteúdo complexo",
        "Comunidade ativa, não plataforma abandonada"
      ],
      "ctaLabel": "QUERO SEGUIR O MÉTODO"
    },
    {
      "id": "nicho",
      "type": "multichoice",
      "title": "Com quais nichos você mais se identifica?",
      "hint": "Escolha até 3 — ajuda a personalizar sua loja e seu diagnóstico:",
      "minSelect": 1,
      "maxSelect": 3,
      "ctaLabel": "Continuar",
      "options": [
        {
          "id": "moda_masc",
          "label": "Moda masculina 👕",
          "tags": [
            "niche_moda_masc"
          ]
        },
        {
          "id": "moda_fem",
          "label": "Moda feminina 👗",
          "tags": [
            "niche_moda_fem"
          ]
        },
        {
          "id": "beleza",
          "label": "Beleza e cosméticos 💄",
          "tags": [
            "niche_beleza"
          ]
        },
        {
          "id": "saude",
          "label": "Saúde e bem-estar 🌿",
          "tags": [
            "niche_saude"
          ]
        },
        {
          "id": "pet",
          "label": "Pet 🐾",
          "tags": [
            "niche_pet"
          ]
        },
        {
          "id": "casa",
          "label": "Casa e praticidade 🏠",
          "tags": [
            "niche_casa"
          ]
        },
        {
          "id": "tech",
          "label": "Tecnologia 💻",
          "tags": [
            "niche_tech"
          ]
        },
        {
          "id": "infantil",
          "label": "Infantil 🧸",
          "tags": [
            "niche_infantil"
          ]
        }
      ]
    },
    {
      "id": "prova_dinamica",
      "type": "dynamic",
      "title": "Isso é para pessoas como você",
      "body": "Mais de 500 alunos já aplicam o método Ascend com mentoria ao vivo e networking real.\n\nCom base no que você busca — {{objetivo}} —, no seu momento — {{momento}} — e nos nichos {{nicho}}, o programa combina loja pronta com produtos validados, calls semanais e suporte próximo.\n\nContinue respondendo para receber seu diagnóstico personalizado 👇",
      "ctaLabel": "Continuar minha análise",
      "imageUrl": "/media/proof/proof-06.jpeg"
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
            "variant": "print",
            "proof": {
              "imageUrl": "/media/proof/proof-04.jpeg",
              "imageCaption": "Print real — começando do zero"
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
            "variant": "print",
            "proof": {
              "imageUrl": "/media/proof/proof-05.jpeg",
              "imageCaption": "Print real — acompanhamento no programa"
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
            "variant": "print",
            "proof": {
              "imageUrl": "/media/proof/proof-06.jpeg",
              "imageCaption": "Print real — evolução com estrutura"
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
            "variant": "print",
            "proof": {
              "imageUrl": "/media/proof/proof-07.jpeg",
              "imageCaption": "Print real — passo a passo aplicado"
            }
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
            "variant": "print",
            "proof": {
              "imageUrl": "/media/proof/proof-08.jpg",
              "imageCaption": "Print real — comunidade Ascend Club"
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
            "variant": "print",
            "proof": {
              "imageUrl": "/media/proof/proof-09.jpg",
              "imageCaption": "Print real de resultado — mesmos da landing"
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
            "variant": "print",
            "proof": {
              "imageUrl": "/media/proof/proof-10.jpg",
              "imageCaption": "Print real — suporte e evolução no programa"
            }
          }
        }
      ]
    },
    {
      "id": "prioridades",
      "type": "multichoice",
      "title": "O que seria mais importante pra você em uma mentoria?",
      "hint": "Escolha até 3 opções que mais combinam com você:",
      "minSelect": 2,
      "maxSelect": 3,
      "ctaLabel": "Continuar",
      "options": [
        {
          "id": "flexibilidade",
          "label": "Trabalhar de qualquer lugar, no meu ritmo",
          "tags": [
            "want_flexibility"
          ]
        },
        {
          "id": "suporte",
          "label": "Ter suporte ao vivo quando travar",
          "tags": [
            "needs_support"
          ]
        },
        {
          "id": "networking",
          "label": "Networking e conexões com outros alunos",
          "tags": [
            "want_networking"
          ]
        },
        {
          "id": "metodo",
          "label": "Passo a passo claro do zero",
          "tags": [
            "blocker_direction",
            "stage_zero"
          ]
        },
        {
          "id": "tempo_familia",
          "label": "Mais tempo para família e lazer",
          "tags": [
            "want_lifestyle"
          ]
        },
        {
          "id": "renda",
          "label": "Renda extra consistente",
          "tags": [
            "goal_income"
          ]
        }
      ]
    },
    {
      "id": "compromisso",
      "type": "choice",
      "title": "Você começaria com mentoria + calls + networking assim?",
      "options": [
        {
          "id": "sim_agora",
          "label": "Com certeza! Preciso disso 🔥",
          "tags": [
            "commit_high"
          ]
        },
        {
          "id": "sim_logo",
          "label": "Sim, quero começar logo 🏃",
          "tags": [
            "commit_high"
          ]
        }
      ]
    },
    {
      "id": "autoridade",
      "type": "message",
      "title": "Quem está por trás do seu diagnóstico?",
      "variant": "authority",
      "imageUrl": "/media/mentor-kelvin.jpeg",
      "body": "Prazer — somos Kelvin Martins e Erick Vinicius, co-fundadores do Ascend Club.\n\nJá ajudamos centenas de alunos a construírem suas primeiras fontes de renda online com estratégias simples, calls ao vivo e suporte próximo.\n\nNo Ascend Club você não compra mais um curso gravado: entra em uma mentoria em grupo com networking real e acompanhamento durante todo o processo.",
      "ctaLabel": "GERAR MEU DIAGNÓSTICO"
    },
    {
      "id": "oferta",
      "type": "offer",
      "title": "Sua vaga no Ascend Club",
      "body": "12 meses de mentoria em grupo, comunidade e suporte próximo — com loja online pronta, produtos validados por nicho e identidade visual personalizada. Pagamento único.",
      "priceLabel": "R$60",
      "originalPriceLabel": "R$197",
      "urgencyNote": "Condição liberada só nesta sessão de diagnóstico",
      "priceNote": "Menos de R$0,17 por dia · 1 ano completo",
      "bullets": [
        "Loja online pronta com produtos validados no nicho escolhido",
        "Logo, banner e identidade visual personalizados",
        "Método passo a passo para iniciantes",
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
      "Seu perfil foi aprovado para o diagnóstico Ascend!",
      "Cruzando com alunos no mesmo momento…",
      "Calculando seu encaixe com a mentoria…",
      "Gerando sua condição personalizada…"
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
    "badge": "PERFIL IDEAL",
    "highlights": [
      "Comprometimento real com mudança — raro entre quem responde",
      "Encaixe com mentoria ao vivo + networking, não curso gravado",
      "Condição especial liberada nesta sessão de diagnóstico"
    ],
    "reassurance": "Com base nas suas respostas, liberamos uma condição especial nesta sessão — válida enquanto esta página estiver aberta."
  },
  "resultRules": [
    {
      "whenTags": [
        "stage_zero"
      ],
      "headline": "Você tem perfil para começar do zero com direcionamento claro",
      "badge": "ALTO POTENCIAL",
      "highlights": [
        "Perfil iniciante — método desenhado para quem ainda não começou",
        "Passo a passo + calls ao vivo para não travar sozinho",
        "Suporte próximo no WhatsApp durante o programa"
      ],
      "reassurance": "O método Ascend foi desenhado para quem ainda não começou — com passo a passo e suporte próximo."
    },
    {
      "whenTags": [
        "needs_support"
      ],
      "headline": "Você precisa de mentoria — não de mais um curso gravado",
      "badge": "PERFIL IDEAL",
      "highlights": [
        "Prioridade: acompanhamento ao vivo nas 2 calls semanais",
        "Comunidade ativa para não ficar sozinho no processo",
        "Destrave rápido com suporte do time"
      ],
      "reassurance": "Calls ao vivo, WhatsApp e comunidade ativa: acompanhamento real durante todo o processo."
    },
    {
      "whenTags": [
        "goal_transition"
      ],
      "headline": "Sua transição para o digital pode ser guiada passo a passo",
      "badge": "PERFIL IDEAL",
      "highlights": [
        "Networking para construir autonomia sem virada solitária",
        "Mentoria enquanto você mantém renda atual",
        "Direcionamento claro em cada etapa da transição"
      ],
      "reassurance": "Mentoria + networking para você construir autonomia sem ficar sozinho na virada."
    },
    {
      "whenTags": [
        "goal_scale"
      ],
      "headline": "Você tem base para escalar com estrutura e networking",
      "badge": "ALTO POTENCIAL",
      "highlights": [
        "Estrutura para organizar o que já começou",
        "Networking para parcerias e próximo nível",
        "Calls e ferramentas usadas por quem já vende online"
      ],
      "reassurance": "Ferramentas, calls e comunidade para organizar o próximo nível do seu negócio digital."
    },
    {
      "whenTags": [
        "commit_high"
      ],
      "headline": "Você demonstrou compromisso — perfil que mais evolui no Ascend",
      "badge": "ALTO POTENCIAL",
      "highlights": [
        "Comprometimento real com a mudança",
        "Pronto para seguir método + calls + comunidade",
        "Condição especial liberada agora"
      ]
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
