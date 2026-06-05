INSERT INTO form_definitions (slug, name, schema, is_active)
VALUES ('ascend-ads', 'Quiz anúncios (Ascend Club)', '{
  "version": 1,
  "landing": {
    "eyebrow": "Diagnóstico gratuito · Ascend Club",
    "headline": "Veja se o Ascend Club resolve o que você busca: renda online, liberdade financeira e geográfica — sem precisar aparecer",
    "subheadline": "Responda em poucos minutos. Entendemos seu momento e mostramos o plano adaptado: loja pronta com produtos selecionados, ensino de como vender e mentoria ao vivo. Não é curso gravado. Sem cartão.",
    "ctaLabel": "COMEÇAR MEU DIAGNÓSTICO",
    "socialProof": "⚡ +500 alunos já no programa — loja, vendas e mentoria ao vivo"
  },
  "steps": [
    {
      "id": "objetivo",
      "type": "choice",
      "title": "O que você mais quer resolver agora?",
      "hint": "Seu problema define como vamos adaptar o programa pra você.",
      "options": [
        {
          "id": "renda_extra",
          "label": "Ter uma renda extra consistente",
          "subtitle": "Mais dinheiro entrando todo mês",
          "tags": [
            "goal_income"
          ],
          "insight": {
            "eyebrow": "SEU PLANO",
            "title": "Renda extra sem montar negócio do zero",
            "body": "Você recebe loja pronta com produtos já selecionados no nicho, aprende a divulgar e vender com acompanhamento — e tem 2 calls ao vivo por semana quando travar.",
            "variant": "print",
            "proof": {
              "imageUrl": "/media/proof/proof-01.jpeg",
              "imageCaption": "Print real — renda online no Ascend Club"
            }
          }
        },
        {
          "id": "liberdade_fin",
          "label": "Conquistar liberdade financeira",
          "subtitle": "Não depender só de salário ou de um emprego",
          "tags": [
            "goal_freedom",
            "goal_income"
          ],
          "insight": {
            "eyebrow": "SEU PLANO",
            "title": "Uma loja que gera renda com método e suporte",
            "body": "Loja online pronta, produtos validados e ensino de como vender — com mentoria ao vivo pegando na sua mão. Não é curso que você assiste e fica perdido.",
            "variant": "print",
            "proof": {
              "imageUrl": "/media/proof/proof-02.jpg",
              "imageCaption": "Print real — resultado no digital"
            }
          }
        },
        {
          "id": "liberdade_geo",
          "label": "Liberdade geográfica — trabalhar de onde eu quiser",
          "subtitle": "Renda online sem ficar preso a um lugar",
          "tags": [
            "want_flexibility",
            "want_geo"
          ],
          "insight": {
            "eyebrow": "SEU PLANO",
            "title": "Loja online que roda de qualquer lugar",
            "body": "Você vende pela internet com loja pronta e produtos selecionados — sem escritório, sem chefe, sem horário fixo. A mentoria te ensina a divulgar e destrava nas calls ao vivo.",
            "variant": "print",
            "proof": {
              "imageUrl": "/media/proof/proof-03.jpeg",
              "imageCaption": "Print real — liberdade com loja online"
            }
          }
        },
        {
          "id": "transicao",
          "label": "Sair do CLT e construir renda online",
          "subtitle": "Virada com estrutura, não no escuro",
          "tags": [
            "goal_transition"
          ],
          "insight": {
            "eyebrow": "SEU PLANO",
            "title": "Transição guiada — loja + vendas + mentoria",
            "body": "Enquanto você ainda tem renda fixa, montamos sua loja com produtos validados e te ensinamos a vender com suporte ao vivo. Networking com quem está na mesma virada.",
            "variant": "print",
            "proof": {
              "imageUrl": "/media/proof/proof-04.jpeg",
              "imageCaption": "Print real — transição para o digital"
            }
          }
        }
      ]
    },
    {
      "id": "momento",
      "type": "choice",
      "title": "Qual frase melhor descreve seu momento hoje?",
      "hint": "Isso nos ajuda a adaptar o plano — loja, produtos e mentoria — ao que você vive agora.",
      "options": [
        {
          "id": "esforco_pouco",
          "label": "Trabalho muito e ganho pouco pro tanto que me esforço",
          "subtitle": "Quero mais retorno pelo meu tempo",
          "tags": [
            "pain_underpaid"
          ],
          "insight": {
            "eyebrow": "ADAPTADO AO SEU MOMENTO",
            "title": "Você precisa de retorno — não de mais esforço às cegas",
            "body": "Pra quem trabalha muito e ganha pouco, o plano é direto: loja pronta, produtos selecionados e ensino de vendas com mentoria ao vivo. Você foca em vender, não em montar tudo sozinho.",
            "variant": "print",
            "proof": {
              "imageUrl": "/media/proof/proof-05.jpeg",
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
            "eyebrow": "ADAPTADO AO SEU MOMENTO",
            "title": "Renda extra sem largar o que já te paga as contas",
            "body": "Loja online rodando em paralelo, produtos validados no nicho e mentoria te guiando na divulgação — no seu ritmo, com calls quando precisar destravar.",
            "variant": "print",
            "proof": {
              "imageUrl": "/media/proof/proof-06.jpeg",
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
      "id": "barreira",
      "type": "choice",
      "title": "O que mais te impede de ter renda online hoje?",
      "hint": "Seu bloqueio define como adaptamos o plano pra você.",
      "options": [
        {
          "id": "sem_caminho",
          "label": "Não sei por onde começar — produto, loja, venda",
          "tags": [
            "blocker_direction"
          ],
          "insight": {
            "eyebrow": "REMÉDIO PRA ISSO",
            "title": "A gente entrega a loja e os produtos — você aprende a vender",
            "body": "Você não precisa descobrir sozinho o que vender. Loja pronta, produtos selecionados no nicho e passo a passo de divulgação com mentoria ao vivo.",
            "variant": "print",
            "proof": {
              "imageUrl": "/media/proof/proof-07.jpeg",
              "imageCaption": "Print real — passo a passo aplicado"
            }
          }
        },
        {
          "id": "sem_aparecer",
          "label": "Não quero aparecer, gravar vídeo ou ser influencer",
          "tags": [
            "blocker_no_face",
            "want_anonymous"
          ],
          "insight": {
            "eyebrow": "REMÉDIO PRA ISSO",
            "title": "Você vende sem precisar mostrar o rosto",
            "body": "Loja online + divulgação que não exige vídeo na câmera. A mentoria ensina na prática como vender esses produtos — com calls ao vivo quando travar.",
            "variant": "print",
            "proof": {
              "imageUrl": "/media/proof/proof-08.jpg",
              "imageCaption": "Print real — vendas sem aparecer"
            }
          }
        },
        {
          "id": "sozinho",
          "label": "Já tentei e travei sozinho — curso, loja ou afiliado",
          "tags": [
            "blocker_isolation",
            "needs_support",
            "stage_stuck"
          ],
          "insight": {
            "eyebrow": "REMÉDIO PRA ISSO",
            "title": "Não é curso gravado — é pegar na mão e ensinar a vender",
            "body": "Loja pronta com produtos validados + 2 calls ao vivo por semana + WhatsApp. Dúvida na hora, não módulo abandonado.",
            "variant": "print",
            "proof": {
              "imageUrl": "/media/proof/proof-09.jpg",
              "imageCaption": "Print real — acompanhamento no programa"
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
            "eyebrow": "REMÉDIO PRA ISSO",
            "title": "Produtos validados + prints reais de quem já vendeu",
            "body": "Centenas de alunos no mesmo programa — loja entregue, produtos selecionados e mentoria ao vivo. O caminho existe se você seguir o direcionamento.",
            "variant": "print",
            "proof": {
              "imageUrl": "/media/proof/proof-10.jpg",
              "imageCaption": "Print real de resultado"
            }
          }
        },
        {
          "id": "tempo",
          "label": "Tenho pouco tempo — não posso montar loja do zero",
          "tags": [
            "blocker_time",
            "needs_support"
          ],
          "insight": {
            "eyebrow": "REMÉDIO PRA ISSO",
            "title": "Loja pronta — você só aprende a vender no seu ritmo",
            "body": "Sem semanas montando vitrine e caçando produto. Loja entregue, produtos no nicho e calls ao vivo pra destravar quando precisar.",
            "variant": "print",
            "proof": {
              "imageUrl": "/media/proof/proof-01.jpeg",
              "imageCaption": "Print real — evolução no programa"
            }
          }
        }
      ]
    },
    {
      "id": "situacao",
      "type": "choice",
      "title": "Onde você está hoje nessa jornada?",
      "hint": "Isso ajusta o ritmo do plano — do zero ou com experiência.",
      "options": [
        {
          "id": "zero",
          "label": "Nunca vendi online de verdade",
          "tags": [
            "stage_zero"
          ],
          "insight": {
            "eyebrow": "PLANO DO ZERO",
            "title": "Começo com loja pronta — não com tela em branco",
            "body": "Produtos já selecionados, loja configurada e ensino de como divulgar e vender. A mentoria ao vivo pega na sua mão desde a primeira venda.",
            "variant": "print",
            "proof": {
              "imageUrl": "/media/proof/proof-02.jpg",
              "imageCaption": "Print real — começando do zero"
            }
          }
        },
        {
          "id": "curso_parado",
          "label": "Já fiz curso ou tentei loja, mas travei sozinho",
          "tags": [
            "stage_stuck",
            "needs_support"
          ],
          "insight": {
            "eyebrow": "PLANO PRA QUEM TRAVOU",
            "title": "Dessa vez com loja entregue e gente ao vivo",
            "body": "Não é mais um curso gravado. Loja pronta, produtos validados e calls semanais pra destravar na hora — com WhatsApp quando precisar.",
            "variant": "print",
            "proof": {
              "imageUrl": "/media/proof/proof-03.jpeg",
              "imageCaption": "Print real — acompanhamento no programa"
            }
          }
        },
        {
          "id": "vendendo",
          "label": "Já vendo e quero estrutura + novo nicho",
          "tags": [
            "stage_selling"
          ],
          "insight": {
            "eyebrow": "PLANO PRA ESCALAR",
            "title": "Nova loja estruturada + mentoria para organizar vendas",
            "body": "Produtos validados em outro nicho, identidade visual profissional e networking com quem já está vendendo no programa.",
            "variant": "print",
            "proof": {
              "imageUrl": "/media/proof/proof-04.jpeg",
              "imageCaption": "Print real — evolução com estrutura"
            }
          }
        }
      ]
    },
    {
      "id": "nicho",
      "type": "multichoice",
      "title": "Em quais nichos você se vê vendendo?",
      "hint": "Escolha até 3 — definimos os produtos da sua loja:",
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
      "id": "mecanismo",
      "type": "mechanism",
      "title": "O que o Ascend Club entrega — o remédio completo",
      "intro": "Não é curso comum. É loja + produtos + ensino de vendas + mentoria ao vivo, adaptado ao que você respondeu.",
      "mechanismSteps": [
        {
          "title": "Loja pronta com produtos selecionados",
          "subtitle": "No nicho que você escolheu — com logo, banner e identidade visual personalizados",
          "highlight": "1 · Loja entregue"
        },
        {
          "title": "A gente pega na sua mão e ensina a vender",
          "subtitle": "Como divulgar esses produtos e fazer as primeiras vendas — passo a passo, sem aparecer se não quiser",
          "highlight": "2 · Ensino de vendas"
        },
        {
          "title": "Mentoria ao vivo + suporte quando travar",
          "subtitle": "2 calls por semana, WhatsApp e networking — diferente de curso gravado que você assiste sozinho",
          "highlight": "3 · Ao vivo"
        }
      ],
      "bullets": [
        "Você não monta loja nem caça produto sozinho",
        "Pode vender sem gravar vídeo ou aparecer",
        "Plano adaptado ao seu momento e ao seu bloqueio"
      ],
      "ctaLabel": "ISSO FAZ SENTIDO PRA MIM"
    },
    {
      "id": "prova_dinamica",
      "type": "dynamic",
      "title": "Seu plano, adaptado ao que você contou",
      "body": "Você busca {{objetivo}}, está num momento de {{momento}}, e o que mais te impede é: {{barreira}}.\n\nNichos escolhidos: {{nicho}}.\n\nO plano Ascend pra você: loja pronta com produtos selecionados nesses nichos + ensino de como vender + mentoria ao vivo pegando na sua mão. Não é curso gravado.\n\nFalta pouco pro seu diagnóstico final 👇",
      "ctaLabel": "Continuar",
      "imageUrl": "/media/proof/proof-06.jpeg"
    },
    {
      "id": "prioridades",
      "type": "multichoice",
      "title": "O que não pode faltar no SEU plano?",
      "hint": "Escolha até 3 — confirmamos o que adaptamos pra você:",
      "minSelect": 2,
      "maxSelect": 3,
      "ctaLabel": "Continuar",
      "options": [
        {
          "id": "loja_pronta",
          "label": "Loja pronta — não montar do zero",
          "tags": [
            "want_store"
          ]
        },
        {
          "id": "sem_aparecer",
          "label": "Vender sem precisar aparecer",
          "tags": [
            "blocker_no_face",
            "want_anonymous"
          ]
        },
        {
          "id": "ensino_venda",
          "label": "Alguém me ensinando a vender na prática",
          "tags": [
            "needs_support"
          ]
        },
        {
          "id": "calls_vivo",
          "label": "Mentoria ao vivo — não só vídeo gravado",
          "tags": [
            "needs_support"
          ]
        },
        {
          "id": "flexibilidade",
          "label": "Trabalhar de qualquer lugar",
          "tags": [
            "want_flexibility",
            "want_geo"
          ]
        },
        {
          "id": "renda",
          "label": "Renda que não depende só de salário",
          "tags": [
            "goal_income",
            "goal_freedom"
          ]
        }
      ]
    },
    {
      "id": "compromisso",
      "type": "choice",
      "title": "Você começaria com loja pronta + ensino de vendas + mentoria ao vivo?",
      "options": [
        {
          "id": "sim_agora",
          "label": "Sim — é exatamente o que preciso 🔥",
          "tags": [
            "commit_high"
          ]
        },
        {
          "id": "sim_logo",
          "label": "Sim, quero ver meu diagnóstico 🏃",
          "tags": [
            "commit_high"
          ]
        }
      ]
    },
    {
      "id": "autoridade",
      "type": "message",
      "title": "Quem monta sua loja e te ensina a vender",
      "variant": "authority",
      "imageUrl": "/media/mentor-kelvin.jpeg",
      "body": "Kelvin Martins e Erick Vinicius, co-fundadores do Ascend Club.\n\nEntregamos loja online pronta com produtos selecionados, pegamos na mão de cada aluno pra ensinar a vender — e acompanhamos com calls ao vivo e suporte no WhatsApp.\n\nNão somos curso gravado. Somos loja + vendas + mentoria real.",
      "ctaLabel": "GERAR MEU DIAGNÓSTICO"
    },
    {
      "id": "oferta",
      "type": "offer",
      "title": "Seu plano Ascend Club — loja + vendas + mentoria",
      "body": "Loja online pronta com produtos selecionados no seu nicho, ensino de como divulgar e vender, e 12 meses de mentoria ao vivo com suporte próximo. Pagamento único.",
      "priceLabel": "R$60",
      "originalPriceLabel": "R$197",
      "urgencyNote": "Plano personalizado liberado só nesta sessão",
      "priceNote": "Menos de R$0,17 por dia · loja + mentoria 1 ano",
      "bullets": [
        "Loja pronta com produtos validados no nicho escolhido",
        "Logo, banner e identidade visual personalizados",
        "Ensino de como divulgar e vender esses produtos",
        "2 calls ao vivo por semana + suporte no WhatsApp",
        "Networking com +500 alunos no mesmo programa",
        "Venda sem precisar aparecer ou gravar vídeo"
      ],
      "ctaLabel": "QUERO MEU PLANO COMPLETO"
    }
  ],
  "calculating": {
    "messages": [
      "Entendendo seu problema e seu momento…",
      "Selecionando produtos do nicho escolhido…",
      "Montando seu plano: loja + vendas + mentoria…",
      "Adaptando ao que mais te impede hoje…",
      "Gerando seu diagnóstico personalizado…"
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
    "eyebrow": "SEU PLANO ESTÁ PRONTO",
    "headline": "Adaptamos o Ascend Club ao seu problema e ao seu momento",
    "badge": "PERFIL IDEAL",
    "highlights": [
      "Loja pronta com produtos selecionados no nicho que você escolheu",
      "Ensino de vendas + mentoria ao vivo — não é curso gravado",
      "Plano montado com base no que você contou neste diagnóstico"
    ],
    "reassurance": "Com base nas suas respostas, liberamos seu plano personalizado nesta sessão — válido enquanto esta página estiver aberta."
  },
  "resultRules": [
    {
      "whenTags": [
        "blocker_no_face"
      ],
      "headline": "Seu plano: vender online sem precisar aparecer",
      "badge": "PERFIL IDEAL",
      "highlights": [
        "Loja pronta + divulgação sem vídeo na câmera",
        "Ensino de vendas adaptado pra quem não quer ser influencer",
        "Mentoria ao vivo quando travar"
      ],
      "reassurance": "Adaptamos o ensino de vendas pro seu perfil — loja, produtos e suporte, sem aparecer."
    },
    {
      "whenTags": [
        "want_geo",
        "want_flexibility"
      ],
      "headline": "Seu plano: renda de qualquer lugar, com loja rodando",
      "badge": "PERFIL IDEAL",
      "highlights": [
        "Loja online que você opera de onde estiver",
        "Produtos selecionados no nicho — sem escritório fixo",
        "Mentoria ao vivo no seu ritmo"
      ]
    },
    {
      "whenTags": [
        "stage_zero"
      ],
      "headline": "Seu plano: começar com loja pronta, não do zero absoluto",
      "badge": "ALTO POTENCIAL",
      "highlights": [
        "Produtos já selecionados no nicho escolhido",
        "Ensino de vendas pegando na sua mão",
        "2 calls semanais + WhatsApp"
      ],
      "reassurance": "Você não monta loja sozinho — recebe pronta e aprende a vender com acompanhamento."
    },
    {
      "whenTags": [
        "needs_support",
        "stage_stuck"
      ],
      "headline": "Seu plano: loja entregue + mentoria ao vivo (não curso gravado)",
      "badge": "PERFIL IDEAL",
      "highlights": [
        "Pra quem já travou sozinho em curso ou loja",
        "Calls semanais + suporte no WhatsApp",
        "Produtos validados — foco em vender"
      ]
    },
    {
      "whenTags": [
        "goal_transition"
      ],
      "headline": "Seu plano: transição guiada com loja + renda em paralelo",
      "badge": "PERFIL IDEAL",
      "highlights": [
        "Loja montada enquanto você mantém o CLT",
        "Ensino de vendas no seu ritmo",
        "Networking com quem está na mesma virada"
      ]
    },
    {
      "whenTags": [
        "commit_high"
      ],
      "headline": "Você está pronto — plano personalizado liberado",
      "badge": "ALTO POTENCIAL",
      "highlights": [
        "Loja + produtos + ensino de vendas + mentoria ao vivo",
        "Adaptado ao que você contou no diagnóstico",
        "Condição especial nesta sessão"
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
}'::jsonb, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, schema = EXCLUDED.schema, is_active = EXCLUDED.is_active;