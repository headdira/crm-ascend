---
agent: kiwify-api
version: 1.0.0
description: Referência da API Kiwify (vendas, webhooks, CRM Ascend) — fonte humana docs/kiwify-api-reference.md
---

# Kiwify API Agent

> Consulte antes de integrar vendas, webhooks ou sync CRM. Documentação completa em `docs/kiwify-api-reference.md`.

## capability: agent_role
**signature:** `() -> string`
**primitive:** extract
**section:** agent_role

### agent_role
Você é o agente de referência da API Kiwify para o CRM Ascend.
Responda sobre autenticação OAuth, endpoints REST, webhooks de venda, mapeamento para aluno/contrato/caso, e carrinho abandonado.
Diferencie API de vendas (OAuth, public-api.kiwify.com/v1) da API Conta Digital (Ed25519, banking).
Fonte canônica: docs/kiwify-api-reference.md e https://docs.kiwify.com.br/llms.txt

## capability: docs_index
**signature:** `() -> string`
**primitive:** extract
**section:** docs_index

### docs_index
Índice rápido — capabilities MCP deste agente:
- agent_role — papel do agente
- authentication — OAuth e headers
- endpoints_overview — tabela REST vendas
- sales_api — vendas, status, customer, tracking
- webhooks_api — CRUD + triggers + CRM
- products_api — listagem produtos
- finance_api — saldo e saques
- affiliates_api — afiliados
- events_api — participantes ingressos
- crm_integration — fluxo Ascend aluno/contrato/onboarding/lead

Links: docs/kiwify-api-reference.md | OpenAPI https://docs.kiwify.com.br/api-reference/openapi.json | llms.txt https://docs.kiwify.com.br/llms.txt

## capability: authentication
**signature:** `() -> string`
**primitive:** extract
**section:** authentication

### authentication
Base: https://public-api.kiwify.com/v1/
Headers autenticados: Authorization Bearer {token}, x-kiwify-account-id {account_id}
Credenciais: Dashboard Apps → API → Criar API Key (client_id, client_secret, account_id)
POST /oauth/token — application/x-www-form-urlencoded — client_id + client_secret
Token expira ~86400s (96h para secret); cache e reutilize
Scopes: stats products events sales sales_refund financial affiliates webhooks
Rate limit: 100 req/min → 429
JSON only, datas ISO 8601

## capability: endpoints_overview
**signature:** `() -> string`
**primitive:** extract
**section:** endpoints_overview

### endpoints_overview
POST /oauth/token | GET /account-details | GET /products | GET /products/{id}
GET /sales (start_date+end_date max 90d) | GET /sales/{id} | POST /sales/{id}/refund | GET /stats
GET /balance | GET /balance/{legal_entity_id} | GET/POST /payouts | GET /payouts/{id}
GET /affiliates | GET/PUT /affiliates/{id}
GET/POST /webhooks | GET/PUT/DELETE /webhooks/{id}
GET /events/{product_id}/participants

## capability: sales_api
**signature:** `() -> string`
**primitive:** extract
**section:** sales_api

### sales_api
GET /sales — filtros: status, payment_method (boleto|credit_card|pix), product_id, affiliate_id, view_full_sale_details, updated_at_*, paginação
Status: approved authorized chargedback paid pending pending_refund processing refunded refund_requested refused waiting_payment
Customer: id name email cpf|cnpj mobile instagram country address
Com detalhes: payment (charge_amount net_amount fee), tracking (utm_* src sck s1-s3), affiliate_commission, revenue_partners
GET /sales/{id} — order_id = id
POST /sales/{id}/refund — body opcional { pixKey } — scope sales_refund
GET /stats — credit_card_approval_rate total_sales total_net_amount refund_rate chargeback_rate boleto_*

## capability: webhooks_api
**signature:** `() -> string`
**primitive:** extract
**section:** webhooks_api

### webhooks_api
Triggers: boleto_gerado pix_gerado carrinho_abandonado compra_recusada compra_aprovada compra_reembolsada chargeback subscription_canceled subscription_late subscription_renewed
POST /webhooks body: name url products (uuid|all) triggers[] token?
Painel: Apps → Webhooks — Testar Webhook, Ver logs, reenviar falhas
Payload inbound JSON — schema não documentado na API; espelha venda/cliente; validar token/HMAC
CRM: compra_aprovada → aluno+contrato+onboarding | carrinho_abandonado → enriquecer lead
Não confundir com webhooks banking (Conta Digital, Ed25519)

## capability: products_api
**signature:** `() -> string`
**primitive:** extract
**section:** products_api

### products_api
GET /products paginado — campos: id name type membership created_at currency price affiliate_enabled status payment_type recurring
GET /products/{id} — detalhe
Mapear product.id Kiwify → products.metadata.kiwify_product_id no CRM

## capability: finance_api
**signature:** `() -> string`
**primitive:** extract
**section:** finance_api

### finance_api
GET /balance — todos saldos | GET /balance/{legal_entity_id}
GET /payouts listar saques | POST /payouts/ solicitar saque (status no dashboard) | GET /payouts/{id}
Scope: financial — distinto da API banking Pix (Ed25519)

## capability: affiliates_api
**signature:** `() -> string`
**primitive:** extract
**section:** affiliates_api

### affiliates_api
GET /affiliates listar | GET /affiliates/{id} consultar | PUT /affiliates/{id} editar
Webhooks afiliado: PII do comprador só se produtor permitir

## capability: events_api
**signature:** `() -> string`
**primitive:** extract
**section:** events_api

### events_api
GET /events/{product_id}/participants — ingressos/eventos
Filtros: checked_in datas external_id batch_id phone cpf order_id paginação
Retorna max_tickets available sold_tickets participants[] com checkin_at order_id

## capability: crm_integration
**signature:** `() -> string`
**primitive:** extract
**section:** crm_integration

### crm_integration
Estado atual Ascend: landing captura lead antes checkout (reached_kiwify_at); sem webhook Kiwify ainda
compra_aprovada: validar webhook → match lead email_hash → students → contracts draft+lines → activateContract enrollments → cases (ONBOARDING ou PED-SUPORTE)
carrinho_abandonado: atualizar leads quiz_answers/utm sem criar aluno
Idempotência: kiwify order id
Env sugerido: KIWIFY_CLIENT_ID SECRET ACCOUNT_ID WEBHOOK_TOKEN
Rota sugerida: apps/crm/src/app/api/webhooks/kiwify/route.ts
Backfill: GET /sales updated_at janela 90 dias
Checkout atual: https://pay.kiwify.com.br/3yXXBij
