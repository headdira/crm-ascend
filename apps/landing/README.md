# Ascend Club — Landing

Site público de vendas (landing, `/form`, `/conhecimento`, `/privacidade`). **Deploy separado** do CRM interno.

Stack: **Astro 5** + React islands (visual idêntico à versão Next).

## Dev

```bash
pnpm install
pnpm --filter @crm-ascend/landing dev   # http://localhost:3000
```

## Checkout / lead

**Landing principal (`/`):** ao clicar em qualquer CTA de compra, abre um modal em três etapas (nome → e-mail → WhatsApp). Após enviar, o lead é gravado via `POST /api/sales/lead` e o usuário segue para a Kiwify.

**Quiz de anúncios (`/form`):** funil em etapas (perguntas → oferta → contato) para campanhas pagas. Config editável no CRM em **Formulário** (`/crm/forms`). Progresso parcial via `type: quiz_progress`; conclusão via `type: quiz_complete`.

## Variáveis

Copie `.env.example` para `.env.local`. Credenciais Supabase (`SUPABASE_SERVICE_ROLE_KEY`, `HASH_SALT`) na API de lead.

### Meta Pixel + Conversions API

| Variável | Onde | Uso |
|----------|------|-----|
| `PUBLIC_META_PIXEL_ID` | client + server | ID do pixel (Events Manager) |
| `META_CAPI_ACCESS_TOKEN` | **só servidor** | Token da API de conversões |
| `META_TEST_EVENT_CODE` | servidor (opcional) | Testar eventos no Events Manager |

- Pixel carrega só com cookie **marketing** aceito (`ConsentScripts`).
- Evento **`Lead`** (formulário completo): Pixel + CAPI com o mesmo `event_id` (deduplicação).
- **`InitiateCheckout`**: clique no CTA + CAPI via `/api/events`.
- Cookie `_fbc` é criado quando a URL traz `fbclid`.
- No CRM, o lead quente guarda `meta_event_id`, `meta_fbp`, `meta_fbc` em `quiz_answers`.

No **Vercel** (projeto `apps/landing`), configure as mesmas variáveis em Production.

## CRM

O app interno fica em `apps/crm` (porta **3001** em dev): `pnpm --filter @crm-ascend/crm dev`

## Deploy Vercel

- Root Directory do projeto: **`apps/landing`**
- Produção (`main`): domínio **ascendclub.com.br**
- Detalhes: [`docs/deploy/vercel-gitflow.md`](../../docs/deploy/vercel-gitflow.md)
