# Ascend Club — Landing

Site público de vendas (landing, `/conhecimento`, `/privacidade`). **Deploy separado** do CRM interno.

## Dev

```bash
pnpm install
pnpm --filter @crm-ascend/landing dev   # http://localhost:3000
```

## Variáveis

Copie `.env.example` para `.env.local`. As mesmas credenciais Supabase do CRM são usadas na rota `POST /api/sales/lead`.

## CRM

O app interno fica em `apps/crm` (porta **3001** em dev): `pnpm --filter @crm-ascend/crm dev`

## Deploy Vercel

- Root Directory do projeto: **`apps/landing`**
- Produção (`main`): domínio **ascendclub.com.br**
- Detalhes: [`docs/deploy/vercel-gitflow.md`](../../docs/deploy/vercel-gitflow.md)
