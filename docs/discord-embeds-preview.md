# Prévia — Discord Webhook (Diagnóstico por Chamado)

**Plano de envio:** 9 mensagens sequenciais (1 intro + 8 chamados)  
**Limites respeitados:** field value ≤1024 | description ≤4096 | 1 embed/msg

---

## Mensagem 0/9 — Intro (content + embed opcional)

**Content** (≤2000 chars):
```
🔍 Diagnóstico por Chamado — Loovi | 21/05/2026
Ambiente LIVE · Company Loovi_Insurance
Seguem 8 blocos (1 por chamado). ⚠️ Plataforma DevOps com falha — diagnóstico sem dados live de pods.
```

**Embed** (opcional, compacto):
| Propriedade | Valor |
|-------------|-------|
| title | Diagnóstico Suporte — 21/05/2026 |
| color | `#5865F2` (5793266) |
| description | Atlas DB 🔴 · ArgoCD 🔴 · kubectl 🔴 — restaurar antes de ações no cluster. |
| footer | crm-ascend · diagnóstico consolidado |

---

## Mensagem 1/9 — Chamado 1

```json
{
  "embeds": [{
    "title": "🔴 1/8 · Pagamento não consta no CRM",
    "url": "https://loovi.atlassian.net/browse/SL-13848",
    "color": 15548997,
    "fields": [
      {
        "name": "Chamados",
        "value": "`SL-13871` · `SL-13848`",
        "inline": true
      },
      {
        "name": "Severidade",
        "value": "🔴 Highest",
        "inline": true
      },
      {
        "name": "Lado Adyen?",
        "value": "❌ Não (webhook OK)",
        "inline": true
      },
      {
        "name": "Diagnóstico",
        "value": "✅ Webhook **Standard Notification** ativo, sem erros — Adyen dispara eventos.\n❌ Falha entre `provedorpagamento-api` e o **CRM**.",
        "inline": false
      },
      {
        "name": "Causa provável",
        "value": "Fila (SQS/Kafka/RabbitMQ) com mensagens presas, **consumer parado** ou **DLQ** acumulando.",
        "inline": false
      },
      {
        "name": "Ações",
        "value": "• Logs `provedorpagamento-api` nos horários dos pagamentos (`prd-apps`)\n• DLQ no console SQS → **redrive em lotes**\n• `kubectl rollout restart deployment/<consumer>`\n• Customer Area → Webhooks → Webhook Queue",
        "inline": false
      },
      {
        "name": "Paliativo hoje",
        "value": "Teste do webhook Standard Notification (confirmar antes de disparar).",
        "inline": false
      }
    ],
    "footer": { "text": "Bloco 1/8 · Diagnóstico por Chamado" }
  }]
}
```

**Mensagem 1b/9** (só se quiser comandos separados — field Comandos ~380 chars):

```json
{
  "embeds": [{
    "title": "🔴 1/8 · Comandos (CRM / fila)",
    "color": 15548997,
    "fields": [
      {
        "name": "K8s",
        "value": "```bash\nkubectl get pods -A --context=prd-apps | grep -iE \"consumer|worker|queue\"\nkubectl logs -n <ns> <pod-consumer> --tail=100 --context=prd-apps\n```",
        "inline": false
      },
      {
        "name": "AWS SQS",
        "value": "```bash\naws sqs get-queue-attributes --queue-url <dlq> \\\n  --attribute-names ApproximateNumberOfMessages --region us-east-1\n```",
        "inline": false
      }
    ],
    "footer": { "text": "Bloco 1/8 · complemento" }
  }]
}
```

---

## Mensagem 2/9 — Chamado 2

**Preview visual:**

```
┌─────────────────────────────────────────────────────────────┐
│ 🔴 2/8 · Pagamento aprovado sem criação de acesso           │  cor: vermelho
├─────────────────────────────────────────────────────────────┤
│ Chamados          │ Severidade      │ Lado Adyen?          │
│ SL-13763          │ 🔴 Highest+Esc  │ ❌ Não               │
├─────────────────────────────────────────────────────────────┤
│ Diagnóstico                                                 │
│ Webhook WBHK...DTS ativo · AUTHORISATION OK · falha APÓS   │
│ o webhook (lógica de criação de acesso).                    │
├─────────────────────────────────────────────────────────────┤
│ Fluxo                                                       │
│ Adyen → AUTHORISATION → provedorpagamento-api → acesso     │
├─────────────────────────────────────────────────────────────┤
│ Hipóteses                                                   │
│ 1. Sem HTTP 200 [accepted]                                  │
│ 2. Race condition                                           │
│ 3. Timeout downstream                                       │
│ 4. Fila intermediária presa                                 │
├─────────────────────────────────────────────────────────────┤
│ Ações                                                       │
│ • Logs provedorpagamento-api no horário exato               │
│ • Confirmar [accepted] para Adyen                           │
│ • Fornecer PSP Reference do SL-13763                        │
├─────────────────────────────────────────────────────────────┤
│ Paliativo                                                   │
│ Com PSP Reference → confirmar status e entrega do evento.   │
├─────────────────────────────────────────────────────────────┤
│ Bloco 2/8 · Diagnóstico por Chamado                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Mensagem 3/9 — Chamado 3

```
┌─────────────────────────────────────────────────────────────┐
│ 🟠 3/8 · Links não expiram automaticamente                  │  cor: laranja
├─────────────────────────────────────────────────────────────┤
│ SL-13851 · 🟠 Highest                                       │
├─────────────────────────────────────────────────────────────┤
│ Diagnóstico Adyen                                           │
│ • Links expiram só com `expiresAt` na criação               │
│ • Sem expiresAt → **não expiram** (comportamento API)       │
│ • Código provavelmente não envia o campo                    │
├─────────────────────────────────────────────────────────────┤
│ Ações                                                       │
│ • IDs dos links (PLE...) → expirar via API                  │
│ • Dev: incluir expiresAt na criação                        │
├─────────────────────────────────────────────────────────────┤
│ Paliativo AGORA                                             │
│ PATCH /paymentLinks/{id} → status: expired                  │
├─────────────────────────────────────────────────────────────┤
│ Infra (após kubectl)                                        │
│ Verificar CronJob de expiração · trigger manual se existir  │
├─────────────────────────────────────────────────────────────┤
│ Bloco 3/8                                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Mensagem 4/9 — Chamado 4

```
┌─────────────────────────────────────────────────────────────┐
│ 🔴 4/8 · Erro SAP — recorrente                              │  cor: vermelho
├─────────────────────────────────────────────────────────────┤
│ SL-13802 · 13 ocorrências / 90d · 40% dos escalados        │
├─────────────────────────────────────────────────────────────┤
│ Contexto                                                    │
│ SAP na VPC devhml-ec2 (EC2, não EKS). Conector no cluster.  │
├─────────────────────────────────────────────────────────────┤
│ Hipóteses                                                   │
│ • CrashLoopBackOff no conector                                │
│ • Rede EKS ↔ VPC SAP (10.2.0.0/16)                          │
│ • Certificado expirado                                      │
│ • ArgoCD down → deploy travado                              │
├─────────────────────────────────────────────────────────────┤
│ Paliativo                                                   │
│ rollout restart <sap-connector> · nc -zv <sap-host> · logs  │
├─────────────────────────────────────────────────────────────┤
│ 🚨 Estrutural                                               │
│ War-room Squad Engenharia/SAP — não só restart              │
├─────────────────────────────────────────────────────────────┤
│ Bloco 4/8                                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Mensagem 5/9 — Chamado 5

```
┌─────────────────────────────────────────────────────────────┐
│ 🔴 5/8 · Mensalidades não geradas                           │
├─────────────────────────────────────────────────────────────┤
│ SL-13821 · 🔴 Highest (WIP)                                 │
├─────────────────────────────────────────────────────────────┤
│ Hipótese                                                    │
│ CronJob suspenso, falhando ou não deployado (ArgoCD down).  │
├─────────────────────────────────────────────────────────────┤
│ Ações                                                       │
│ • kubectl get cronjobs -A | grep mensalidade/billing      │
│ • describe cronjob → verificar suspend                      │
│ • Trigger manual SOMENTE com validação Dev                  │
├─────────────────────────────────────────────────────────────┤
│ ⚠️ Risco de mensalidades duplicadas se trigger sem alinhamento│
├─────────────────────────────────────────────────────────────┤
│ Bloco 5/8                                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Mensagem 6/9 — Chamado 6

**Pode precisar 2 msgs** (muitos comandos kubectl):

**Msg 6a** — diagnóstico  
**Msg 6b** — comandos (field K8s com code block)

---

## Mensagem 7/9 — Chamado 7

```
┌─────────────────────────────────────────────────────────────┐
│ 🟠 7/8 · Sinistro encerrado automaticamente                 │  cor: laranja
├─────────────────────────────────────────────────────────────┤
│ Bug recorrente · 8 ocorrências                              │
├─────────────────────────────────────────────────────────────┤
│ Hipótese                                                    │
│ CronJob/automação com regra de encerramento incorreta.      │
├─────────────────────────────────────────────────────────────┤
│ Paliativo                                                   │
│ Suspender cronjob SOMENTE se identificado o causador:       │
│ kubectl patch cronjob <nome> -p '{"spec":{"suspend":true}}' │
├─────────────────────────────────────────────────────────────┤
│ Precisa Dev                                                 │
│ Sim — bug de lógica de negócio (prioritário)                │
├─────────────────────────────────────────────────────────────┤
│ Bloco 7/8                                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Mensagem 8/9 — Chamado 8

```
┌─────────────────────────────────────────────────────────────┐
│ 🟠 8/8 · Erro abertura de casos pelo app                    │
├─────────────────────────────────────────────────────────────┤
│ SL-13859 · 🟠 Highest                                       │
├─────────────────────────────────────────────────────────────┤
│ Hipótese                                                    │
│ Dependência em cascata do **SAP** (chamado 4) ou backend    │
│ mobile com crash/timeout.                                   │
├─────────────────────────────────────────────────────────────┤
│ Ações                                                       │
│ 1. Resolver SAP primeiro                                    │
│ 2. Logs backend mobile · verificar ingress                  │
├─────────────────────────────────────────────────────────────┤
│ Bloco 8/8 · Fim da série                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Resumo do plano de envio

| # | Chamado | Msgs | Cor embed |
|---|---------|------|-----------|
| 0 | Intro | 1 | Azul `#5865F2` |
| 1 | SL-13871/48 CRM | 1–2 | Vermelho `15548997` |
| 2 | SL-13763 Acesso | 1 | Vermelho |
| 3 | SL-13851 Links | 1 | Laranja `15105570` |
| 4 | SL-13802 SAP | 1 | Vermelho |
| 5 | SL-13821 Mensalidades | 1 | Vermelho |
| 6 | SL-13808/10 Mercúrio | 1–2 | Vermelho |
| 7 | Sinistro auto | 1 | Laranja |
| 8 | SL-13859 App | 1 | Laranja |

**Total estimado:** 9–11 POSTs no webhook (delay 500ms entre cada para ordem no canal).
