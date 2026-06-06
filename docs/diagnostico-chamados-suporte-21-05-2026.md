# Diagnóstico Consolidado — Chamados Críticos de Suporte

**Referência:** 21/05/2026 às 11h  
**Ambiente:** LIVE  
**Company Adyen:** Loovi_Insurance  
**Merchants:** Loovi_No_Risk, Loovi_recurring  
**Fontes:** DevOps + Adyen + Knowledge Base (16 buscas na KB Atlas)

---

## Alerta de Plataforma — Resolver Antes de Tudo

Durante a investigação, o agente DevOps detectou falhas na própria plataforma de observabilidade:

| Componente | Status | Impacto |
|------------|--------|---------|
| **Atlas DB** | 🔴 CRÍTICO | Pool de conexões esgotado (`FATAL: sorry, too many clients already`) + tabelas ausentes ou schema corrompido |
| **ArgoCD API** | 🔴 INDISPONÍVEL | Connection reset by peer — deploys automáticos podem estar parados |
| **kubectl / K8s API** | 🔴 INDISPONÍVEL | Binário não encontrado no PATH do agente — diagnóstico live de pods impossível |

**Impacto sistêmico:** Um ArgoCD down pode ser causa raiz de vários chamados (deploys de correção travados, CronJobs não deployados, etc.).

### Ações imediatas — Plataforma DevOps

**Atlas DB / PostgreSQL:**

```sql
-- Verificar conexões ativas
SELECT count(*) FROM pg_stat_activity;

-- Matar conexões ociosas (>5 min)
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle'
  AND query_start < now() - interval '5 minutes';
```

- Verificar se o schema foi migrado/dropado acidentalmente (tabelas `applications`, `environments`, `teams` ausentes)
- Checar migration problemática recente no Atlas

**ArgoCD (cluster devops-tools, in-cluster):**

```bash
kubectl get pods -n argocd --context=in-cluster
```

**kubectl agent:**

- Verificar se o pod do agente Atlas está saudável no cluster `devops-tools`

> ⚠️ **Nenhum dado ao vivo foi obtido** nas análises abaixo. Tudo é baseado em padrões operacionais, configuração Adyen e diagnóstico indireto até restaurar o acesso.

---

## Inventário de Webhooks Adyen

### Nível Merchant (Loovi_No_Risk e Loovi_recurring)

⚠️ **Nenhum webhook configurado diretamente nos merchants.** Toda notificação passa pelos webhooks de **company** (Loovi_Insurance).

### Nível Company (Loovi_Insurance) — 2 webhooks encontrados

| ID | Tipo | Descrição | Status | Erro? | URL |
|----|------|-----------|--------|-------|-----|
| `WBHK...47FF` | `report-notification` | Report Notification | ✅ Ativo | 🔴 **hasError: true** | `https://sapiis.loovi.com.br:8443/Api/Loovi/ReportNotification` |
| `WBHK...DTS` | `standard` | Standard Notification | ✅ Ativo | ✅ hasError: false | `provedorpagamento-api.loovi.com.br/...` |

### Webhook Standard Notification (WBHK...DTS) — contexto

| Aspecto | Detalhe |
|---------|---------|
| Eventos | Inclui **AUTHORISATION** |
| TLS | 1.3 (protocolo mais seguro) |
| Autenticação | Senha habilitada (`hasPassword: true`) |
| Escopo | `filterMerchantAccountType: allAccounts` — cobre Loovi_No_Risk e Loovi_recurring |
| Papel | Responsável por disparar eventos para o sistema via `provedorpagamento-api` |

### Webhook Report Notification (WBHK...47FF) — alerta

- **hasError: TRUE** 🔴
- URL: `https://sapiis.loovi.com.br:8443/Api/Loovi/ReportNotification`
- Protocolo: TLS 1.2 (considerar upgrade)
- Impacta **relatórios financeiros**, não os chamados de pagamento listados diretamente
- Endpoint inacessível ou retornando erro — investigar com time TI/SAP

### Limitação Adyen

A API de Gerenciamento Adyen **não expõe logs de entrega de webhook** (histórico, retentativas, respostas HTTP). Isso só é visível em:

**Customer Area → Developers → Webhooks → Webhook Queue**

**Medidas paliativas Adyen disponíveis:**

- Disparar notificação de **teste** via webhook
- ❌ Não é possível reprocessar/reenviar webhooks históricos pela API — somente pelo Customer Area

---

## Lacunas na Knowledge Base (Atlas)

16 buscas realizadas — **nenhum documento retornado** para os 6 tópicos solicitados nos merchants.

| # | Tópico | KB Atlas | Recomendação |
|---|--------|:--------:|--------------|
| 1 | Integração SAP ↔ CRM/Salesforce | ❌ | Confluence + Squad Engenharia/Salesforce |
| 2 | Geração de mensalidades | ❌ | Confluence + Squad Financeiro/Produto |
| 3 | Sinistros (APP Mobile) | ❌ | Confluence + Squad Mobile |
| 4 | Payment Links | ❌ | Confluence + Squad Engenharia |
| 5 | Onboarding/Acesso Novato (SF/Mercúrio) | ❌ | Confluence + Squad Engenharia |
| 6 | Sistema Mercúrio | ❌ | Confluence + Squad Engenharia |

**Contexto de infra disponível (parcial):**

- SAP/IIS roda na **VPC devhml-ec2** (conta AWS dev/hml `384722508177`) — instâncias EC2, não containerizado no EKS
- Categoria ECR `salesforce` no padrão `loovi-{env}-salesforce/{app}` — apps containerizadas via GitOps

**Documentação sugerida para criar no Atlas:**

- Arquitetura e troubleshooting SAP ↔ Salesforce
- Fluxo de geração de mensalidades (jobs, schedules)
- Fluxo de sinistros no APP mobile
- Ciclo de vida de payment links
- Runbook de onboarding
- O que é e como funciona o Mercúrio

---

## Diagnóstico por Chamado

### 🔴 1. Pagamento não consta no CRM — SL-13871, SL-13848

**Severidade:** Highest  
**Diagnóstico Adyen (dados reais):**

- ✅ Webhook Standard Notification ativo, sem erros — Adyen dispara eventos corretamente
- ❌ Falha no lado backend, entre `provedorpagamento-api` e o CRM

**Causa mais provável:** Fila de mensageria (SQS/Kafka/RabbitMQ) com mensagens presas ou consumer parado; DLQ acumulando.

| Ação | Quem | Como |
|------|------|------|
| Verificar logs do `provedorpagamento-api` nos horários dos pagamentos | Dev/DevOps | Logs do pod em `prd-apps` |
| Verificar DLQ acumulada | DevOps/AWS | Console SQS → redrive em lotes pequenos |
| Reiniciar consumer de pagamento | DevOps | `kubectl rollout restart deployment/<consumer> -n <ns> --context=prd-apps` |
| Verificar entregas com falha no Customer Area Adyen | TI/Adyen | Developers → Webhooks → Webhook Queue |

**Comandos (após restaurar kubectl):**

```bash
kubectl get pods -A --context=prd-apps | grep -iE "consumer|worker|queue|rabbit|sqs"
kubectl logs -n <ns-pagamento> <pod-consumer> --tail=100 --context=prd-apps
kubectl get pods -A --context=prd-apps | grep -v Running | grep -v Completed
```

**AWS (fora do K8s):**

```bash
aws sqs get-queue-attributes \
  --queue-url <url-dlq-pagamento> \
  --attribute-names ApproximateNumberOfMessages \
  --region us-east-1

aws sqs receive-message --queue-url <url-dlq> --max-number-of-messages 10
```

**Paliativo disponível hoje:** Teste do webhook Standard Notification (requer confirmação).

---

### 🔴 2. Pagamento aprovado sem criação de acesso — SL-13763 (Escalado)

**Severidade:** Highest + Escalado  
**Fluxo esperado:**

```
Adyen → webhook AUTHORISATION → provedorpagamento-api → [lógica de negócio] → criação de acesso
```

**Diagnóstico Adyen:**

- Webhook WBHK...DTS ativo, sem `hasError`, inclui AUTHORISATION
- Disparo pelo Adyen está funcionando
- Falha **após** o recebimento do webhook

**Hipóteses:**

1. Endpoint recebeu AUTHORISATION mas não retornou `[accepted]` (ou vice-versa)
2. Race condition: webhook chegou antes do sistema estar pronto
3. Falha downstream (timeout na criação de acesso)
4. Mensagem presa em fila intermediária (Kafka, RabbitMQ, SQS)

| Ação | Quem |
|------|------|
| Verificar logs do `provedorpagamento-api` no horário exato da transação | Dev |
| Confirmar se retornou HTTP 200 com `[accepted]` para o Adyen | Dev |
| Fornecer **PSP Reference** do pagamento do SL-13763 | TI/Suporte |

**Paliativo:** Com o PSP Reference, o Adyen Agent confirma status do pagamento e entrega do evento.

---

### 🟠 3. Links não expiram automaticamente — SL-13851 (Highest)

**Diagnóstico Adyen:**

- Payment Links expiram conforme `expiresAt` definido na criação
- Links **sem** `expiresAt` **não expiram** — comportamento padrão da API
- Provável que o código não envie esse campo
- Links ficam em `active` indefinidamente até pagamento ou expiração manual

**Erros de geração:** 4xx geralmente indicam problema de configuração (merchant account, currency, valor em minor units).

| Ação | Quem |
|------|------|
| Fornecer IDs dos links (`PLE...`) para expiração manual via API | TI/Suporte |
| Dev revisar código de criação para incluir `expiresAt` | Dev |

**Paliativo disponível AGORA:**

```
PATCH /paymentLinks/{linkId}
{ "status": "expired" }
```

**Comandos (após restaurar kubectl):**

```bash
kubectl get cronjobs -A --context=prd-apps | grep -i link
kubectl get jobs -A --context=prd-apps | grep -iE "link|expir"
kubectl describe cronjob <nome-cronjob> -n <ns> --context=prd-apps
kubectl logs job/<nome-job> -n <ns> --context=prd-apps
```

**Trigger manual (se CronJob existir):**

```bash
kubectl create job --from=cronjob/<nome> expiracao-manual-$(date +%s) -n <ns> --context=prd-apps
```

---

### 🔴 4. Erro SAP — SL-13802 (13 ocorrências / 90 dias — recorrente)

**Contexto:** SAP roda na VPC **devhml-ec2** (conta `384722508177`). Integração passa por conector/middleware no cluster EKS — não é workload EKS nativo.

**Hipóteses (sem dados ao vivo):**

- Pod conector em CrashLoopBackOff
- Timeout de rede entre pods EKS e VPC SAP (rota `10.2.0.0/16` → SAP)
- Certificado de integração expirado
- ArgoCD down pode ter travado deploy de correção

| Ação paliativa | Comando |
|----------------|---------|
| Reiniciar conector SAP | `kubectl rollout restart deployment/<sap-connector> -n <ns> --context=prd-apps` |
| Verificar conectividade EKS → SAP | `kubectl exec -it <pod> -- nc -zv <sap-host> <porta>` |
| Verificar logs | `kubectl logs -n <ns-sap> <pod> --tail=100 --context=prd-apps` |

**Comandos:**

```bash
kubectl get pods -A --context=prd-apps | grep -i sap
kubectl get pods -A --context=hml-apps | grep -i sap
kubectl get cronjobs -A --context=prd-apps | grep -i sap
```

🚨 **Ação estrutural:** War-room com Squad Engenharia/SAP — 40% dos escalados, 13x em 90 dias. Não apenas restart de pods.

**Precisa Dev?** Sim, se a causa for lógica de integração (mapeamento de campos, autenticação SAP). Primeiro: restaurar rede e pods.

---

### 🔴 5. Mensalidades não geradas — SL-13821 (Highest, WIP)

**Hipótese:** CronJob de geração suspenso, falhando silenciosamente, ou não deployado (ArgoCD down).

| Ação paliativa | Como |
|----------------|------|
| Listar CronJobs de billing | `kubectl get cronjobs -A --context=prd-apps \| grep -iE "mensalidade\|fatura\|financeiro\|billing\|cobranca"` |
| Verificar se suspenso | `kubectl describe cronjob <nome> -n <ns> --context=prd-apps \| grep -i suspend` |
| Trigger manual | `kubectl create job --from=cronjob/<nome> gera-mensalidade-manual-1 -n <ns> --context=prd-apps` |
| Reativar se suspenso | `kubectl patch cronjob <nome> -n <ns> --context=prd-apps -p '{"spec":{"suspend":false}}'` |

⚠️ **Não executar trigger manual sem alinhamento com Dev** — risco de mensalidades duplicadas.

---

### 🔴 6. Erro Mercúrio / Fotos não carregam — SL-13808, SL-13810 (Highest)

**Hipótese:** Pods degradados (OOMKilled, CrashLoop) ou falha de permissão S3 (IRSA).

```bash
kubectl get pods -n mercurio --context=prd-apps -o wide
kubectl describe pods -n mercurio --context=prd-apps
kubectl get events -n mercurio --context=prd-apps --sort-by='.lastTimestamp'
kubectl logs -n mercurio <pod-mercurio> --tail=100 --context=prd-apps
kubectl logs -n mercurio <pod-mercurio> --previous --tail=100 --context=prd-apps
kubectl top pods -n mercurio --context=prd-apps
kubectl describe sa <service-account> -n mercurio --context=prd-apps
```

**Se OOMKilled:**

```bash
kubectl patch deployment <mercurio> -n mercurio --context=prd-apps -p \
  '{"spec":{"template":{"spec":{"containers":[{"name":"<container>","resources":{"limits":{"memory":"1Gi"}}}]}}}}'
```

**Precisa Dev?** Possivelmente — se for erro de IRSA/S3 ou processamento de imagem.

---

### 🟠 7. Sinistro encerrado automaticamente — Bug recorrente (8 ocorrências)

**Hipótese:** Job/CronJob ou automação com lógica incorreta de encerramento (timeout, status incorreto, regra mal configurada). Retorna periodicamente — correções paliativas sem resolução definitiva.

```bash
kubectl get cronjobs -A --context=prd-apps | grep -iE "sinistro|claim|encerr"
kubectl get pods -A --context=prd-apps | grep -iE "sinistro|claim"
kubectl get deployments -A --context=prd-apps | grep -iE "worker|scheduler|sinistro"
```

**Paliativo (só com certeza do job causador):**

```bash
kubectl patch cronjob <nome> -n <ns> --context=prd-apps -p '{"spec":{"suspend":true}}'
```

**Precisa Dev?** Sim, prioritariamente — bug de lógica de negócio.

---

### 🟠 8. Erro na abertura de casos pelo app — SL-13859 (Highest)

**Hipótese:** Dependência em cascata do SAP (item 4) ou backend mobile com crash/timeout.

```bash
kubectl get pods -A --context=prd-apps | grep -iE "caso|app|mobile|backend"
kubectl get ingress -A --context=prd-apps | grep -i app
kubectl logs -n <ns-backend> <pod> --tail=100 --context=prd-apps
```

**Ação:** Resolver SAP primeiro (item 4), depois investigar logs do backend mobile e ingress.

---

## Quadro Consolidado — O que Podemos Fazer Hoje

| Chamado | Severidade | Pode resolver agora? | Como |
|---------|------------|----------------------|------|
| **Plataforma DevOps** | 🔴 P0 | ❌ | Restaurar Atlas DB + ArgoCD + kubectl primeiro |
| SL-13851 Links não expiram | 🟠 Alta | ✅ **SIM** | IDs dos links (`PLE...`) → expirar via Adyen API |
| SL-13763 Pagamento s/ acesso | 🔴 Highest | ✅ Parcial | PSP Reference → verificar status Adyen |
| SL-13871/48 Pagamento no CRM | 🔴 Alta | 🟡 Parcial | Teste webhook + logs `provedorpagamento-api` |
| SL-13802 SAP | 🔴 Alta | 🟡 Paliativo | Restart conector (requer kubectl) + war-room causa raiz |
| SL-13821 Mensalidades | 🔴 Alta | 🟡 Paliativo | Trigger manual CronJob (validar com Dev antes) |
| SL-13808/10 Mercúrio | 🔴 Alta | 🟡 Paliativo | Restart pods (requer kubectl) |
| SL-13859 App casos | 🟠 Alta | 🟡 Dependente | Resolver SAP primeiro |
| Sinistro automático | 🟠 Média | ❌ | Suspender job + análise de código (Dev) |
| WBHK...47FF Report Notification | 🟡 Alerta | 🟡 Separado | Investigar `sapiis.loovi.com.br:8443` |

---

## Resumo Executivo

| # | Chamado | Severidade | Status Infra | Causa provável | Lado Adyen? | Ação imediata |
|---|---------|------------|--------------|----------------|-------------|---------------|
| 0 | Plataforma DevOps | 🔴 P0 | CRÍTICO | Atlas DB + ArgoCD + kubectl down | — | Restaurar plataforma primeiro |
| 1 | SL-13871, SL-13848 Pagamento CRM | 🔴 Highest | Sem dados live | DLQ / consumer parado / middleware pós-webhook | ❌ Não | Logs `provedorpagamento-api` + redrive DLQ |
| 2 | SL-13763 Pagamento s/ acesso | 🔴 Highest | Sem dados live | Lógica pós-AUTHORISATION / fila intermediária | ❌ Não | Logs urgentes + PSP Reference |
| 3 | SL-13851 Links | 🟠 Alta | Sem dados live | `expiresAt` ausente / CronJob ausente | ⚠️ Parcial | Expirar links via API + corrigir código |
| 4 | SL-13802 SAP | 🔴 Alta | Sem dados live | Conector / rede VPC / certificado | — | Restart + war-room SAP |
| 5 | SL-13821 Mensalidades | 🔴 Alta | Sem dados live | CronJob suspenso/falho | — | Trigger manual c/ validação Dev |
| 6 | SL-13808/10 Mercúrio | 🔴 Alta | Sem dados live | OOMKilled / CrashLoop / S3 IRSA | — | Restart + memória / permissões |
| 7 | SL-13859 App casos | 🟠 Alta | Sem dados live | Dependência SAP / backend mobile | — | SAP primeiro + logs backend |
| 8 | Sinistro automático | 🟠 Média | Sem dados live | Automação com lógica errada | — | Suspender CronJob + Dev analisar |
| — | WBHK...47FF Report | 🟡 Alerta | hasError: true | Endpoint sapiis inacessível | ✅ Sim | Investigar TI/SAP separadamente |

---

## Ordem de Ação Recomendada

1. **AGORA** → Restaurar Atlas DB + ArgoCD + acesso kubectl (acionar DevOps/infra)
2. **AGORA** → Fornecer IDs dos payment links (SL-13851) → expirar via Adyen Agent
3. **AGORA** → Fornecer PSP Reference do SL-13763 → verificar status Adyen
4. **URGENTE** → Com acesso restaurado: re-executar diagnóstico automatizado (pods, logs, CronJobs)
5. **P1** → Mercúrio (usuários sem acesso) + Pagamento CRM (impacto financeiro)
6. **P2** → SAP (40% dos escalados, recorrente) + Mensalidades (impacto financeiro)
7. **P3** → Links expiração + Abertura de casos
8. **DEV** → Sinistro automático (suspender job + corrigir código)
9. **ESTRUTURAL** → War-room SAP com Squad Engenharia
10. **ESTRUTURAL** → Redistribuir carga do Gerson (53% dos críticos em uma pessoa)
11. **CURTO PRAZO** → Criar runbooks no Atlas KB para todos os sistemas sem documentação

---

## Próximos Passos — Ações que o Adyen Agent Pode Executar Agora

| Ação | Requer de você |
|------|----------------|
| Disparar **teste do webhook** Standard Notification | Confirmação |
| **Expirar payment links** específicos (`PATCH` status: expired) | IDs dos links (`PLE...`) — SL-13773, SL-13799, SL-13851 |
| **Verificar status de pagamentos** específicos | PSP References dos chamados |

---

## Referências para Investigação Manual

**Confluence Loovi — buscar:**

- `SAP integration`, `SAP troubleshooting`, `Mercúrio`, `sinistros`, `mensalidades`, `payment link`

**Squads:** Engenharia, Produto, Mobile, Salesforce

**BitBucket — repos relacionados:**

- `mercurio`, `sinistros`, `billing`, `payment`, `mensalidade`

**GitOps:**

- CronJobs/Jobs em `argocd-applications-values/`
- ArgoCD: `argocd.loovi.dev.br` — filtrar categoria `salesforce`

**Adyen Customer Area:**

- Developers → Webhooks → Webhook Queue (entregas com falha)

---

*Documento gerado em 21/05/2026. Assim que Atlas DB, ArgoCD e kubectl estiverem operacionais, refazer diagnóstico com dados reais de pods, logs e CronJobs.*
