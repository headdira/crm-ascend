# CRM Ascend (Fase 1)

CRM interno B2C do projeto Ascend. Especificação completa em [`docs/crm/INDEX.md`](../../docs/crm/INDEX.md).

## Stack

- Next.js 15 (App Router) · TypeScript · Tailwind · shadcn/ui · lucide-react
- Supabase (Postgres 16 + Auth + RLS)
- Monorepo: `@crm-ascend/db`, `@crm-ascend/validation`

## Setup local

1. **Dependências** (raiz do monorepo):

   ```bash
   pnpm install
   ```

2. **Supabase**: crie um projeto ou use `supabase start` na raiz. Aplique migrations:

   ```bash
   supabase db push
   # ou, em projeto remoto:
   supabase link && supabase db push
   ```

3. **Variáveis**: copie `.env.example` para `.env.local` e preencha URL/keys.

4. **Primeiro staff admin**:
   - Crie usuário em Supabase Auth (e-mail/senha).
   - Faça login em `/login` (sync cria `staff_users` com `read_only`).
   - No SQL Editor, promova o usuário:

   ```sql
   UPDATE staff_users SET role = 'admin', is_active = true WHERE email = 'seu@email.com';
   ```

5. **Dev**:

   ```bash
   pnpm --filter @crm-ascend/crm dev
   ```

## LGPD / PII

- Busca por lead/aluno usa `email_hash`, `phone_hash`, `document_hash` (SHA-256 + `HASH_SALT`).
- Colunas `email`, `phone`, `document` em `students` existem para operação interna com RLS (`authenticated` + `staff_users` ativo).
- APIs builder (`/api/crm/*`) usam **service role** e **não** retornam PII em claro.

## APIs Builder

Header obrigatório: `X-Builder-Key: <BUILDER_API_KEY>`

Ver exemplos em [`docs/crm/api-examples.md`](../../docs/crm/api-examples.md).

## Deploy (Vercel)

- Root Directory: **`apps/crm`** (projeto separado da landing)
- Produção (`main`): ex. **`crm.ascendclub.com.br`**
- Env: todas as variáveis de `.env.example`
- GitFlow + dois projetos no mesmo repo: [`docs/deploy/vercel-gitflow.md`](../../docs/deploy/vercel-gitflow.md)
