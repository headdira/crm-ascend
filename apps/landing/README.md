# Ascend Club — Landing

Site público de vendas (landing, `/conhecimento`, `/privacidade`). **Deploy separado** do CRM interno.

Stack: **Astro 5** + React islands (visual idêntico à versão Next).

## Dev

```bash
pnpm install
pnpm --filter @crm-ascend/landing dev   # http://localhost:3000
```

## Checkout / lead

Ao clicar em qualquer CTA de compra, abre um formulário em **duas etapas** (e-mail → telefone). Após enviar, o lead é gravado via `POST /api/sales/lead` e o usuário segue para a Kiwify.

## Variáveis

Copie `.env.example` para `.env.local`. Credenciais Supabase (`SUPABASE_SERVICE_ROLE_KEY`, `HASH_SALT`) na API de lead.

## CRM

O app interno fica em `apps/crm` (porta **3001** em dev): `pnpm --filter @crm-ascend/crm dev`

## Deploy Vercel

- Root Directory do projeto: **`apps/landing`**
- Produção (`main`): domínio **ascendclub.com.br**
- Detalhes: [`docs/deploy/vercel-gitflow.md`](../../docs/deploy/vercel-gitflow.md)
