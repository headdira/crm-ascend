# Conectar GitHub + Supabase + Vercel (passo a passo)

## 1. Login nos navegadores (painel lateral do Cursor)

| Serviço | URL | O que fazer depois de entrar |
|---------|-----|------------------------------|
| **GitHub** | https://github.com/login | Criar repo vazio: **New repository** → nome `crm-ascend` (ou outro) → **sem** README |
| **Vercel** | https://vercel.com/login | Preferir **Continue with GitHub** (mesma conta) |
| **Supabase** | https://supabase.com/dashboard | Entrar → **New project** → região próxima (ex. São Paulo) → anotar senha do DB |

## 2. Terminal — login CLI (na raiz do monorepo)

```bash
cd /home/gerson.moreira/workspace/crm-ascend
pnpm install
pnpm login:supabase    # abre o browser se precisar
pnpm login:vercel      # abre o browser se precisar
```

## 3. Supabase — projeto e variáveis

1. Dashboard → seu projeto → **Settings** → **API**
2. Copiar: `Project URL`, `anon public`, `service_role` (secret)
3. Gerar `HASH_SALT` (string longa aleatória)
4. Colar em:
   - `apps/crm/.env.local`
   - `apps/landing/.env.local`

```bash
cp apps/crm/.env.example apps/crm/.env.local
cp apps/landing/.env.example apps/landing/.env.local
# editar os dois arquivos com as chaves
```

5. Migrations (CLI logado):

```bash
pnpm exec supabase link --project-ref SEU_PROJECT_REF
pnpm exec supabase db push
```

(`project-ref` está na URL do dashboard: `https://supabase.com/dashboard/project/abcdefgh`)

## 4. GitHub — subir o código

No GitHub, após criar o repo vazio, copie a URL `git@github.com:USER/crm-ascend.git` e:

```bash
cd /home/gerson.moreira/workspace/crm-ascend
git add .
git commit -m "chore: monorepo landing + crm"
git branch -M main
git remote add origin git@github.com:SEU_USER/crm-ascend.git
git push -u origin main
```

(Se ainda não tiver SSH no GitHub: use HTTPS ou configure chave em GitHub → Settings → SSH keys.)

## 5. Vercel — dois projetos

### Opção A — Dashboard (recomendado na primeira vez)

1. https://vercel.com/new → **Import** do repo GitHub
2. Projeto **ascend-landing**: Root Directory = `apps/landing` → Deploy
3. De novo **Add New… → Project** → mesmo repo → **ascend-crm**: Root = `apps/crm` → Deploy
4. Em cada projeto: **Settings → Environment Variables** (ver `docs/deploy/vercel-gitflow.md`)

### Opção B — CLI

```bash
pnpm link:vercel:landing   # escolher team, criar/ligar projeto
pnpm link:vercel:crm
```

## 6. Domínios (quando estiver em produção)

- Landing: `ascendclub.com.br`
- CRM: `crm.ascendclub.com.br`

Vercel → projeto → **Domains**.

---

Quando terminar o login nos 3 sites, avise **“logado”** e seguimos com `supabase link`, env e primeiro deploy juntos.
