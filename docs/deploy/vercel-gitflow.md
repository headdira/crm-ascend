# Deploy — GitFlow + Vercel (landing, CRM e Builder separados)

Três projetos Vercel no **mesmo repositório**, com **Root Directory** diferente. Pipeline nativo da Vercel (zero config extra no repo além dos `vercel.json` em cada app).

## Pipeline

```
┌────────────┐   git push   ┌──────────────────┐   webhook   ┌─────────┐
│ Dev (você) │─────────────▶│ GitHub / Bitbucket │────────────▶│ Vercel  │
└────────────┘              │  • main            │             │ build   │
                            │  • feature/*       │             │ test    │
                            │  • PR              │             │ deploy  │
                            └──────────────────┘             └────┬────┘
                                                                  │
                    ┌─────────────────────────────────────────────┘
                    │
     main  ────────▶ produção (domínio fixo)
     PR    ────────▶ preview URL única por PR
     feat/* ───────▶ URL de branch (preview)
```

## Projetos Vercel

| Projeto Vercel | Root Directory | Domínio produção (`main`) | Dev local |
|----------------|----------------|---------------------------|-----------|
| **ascend-landing** | `apps/landing` | `ascendclub.com.br` (e `www`) | `:3000` |
| **ascend-crm** | `apps/crm` | `crm.ascendclub.com.br` (sugestão) | `:3001` |
| **ascend-builder** | `apps/builder` | `ascend-builder.vercel.app` (sugestão) | `:3002` |

### Criar os projetos (uma vez)

1. [vercel.com/new](https://vercel.com/new) → importar o repositório `crm-ascend`.
2. **Projeto 1 — Landing**
   - Nome: `ascend-landing`
   - Root Directory: **`apps/landing`**
   - Framework: Next.js (detectado)
   - Não alterar Install/Build se o `vercel.json` da pasta já estiver no repo.
3. Repetir import do **mesmo repo** para **Projeto 2 — CRM**
   - Nome: `ascend-crm`
   - Root Directory: **`apps/crm`**
4. Repetir import para **Projeto 3 — Builder**
   - Nome: `ascend-builder`
   - Root Directory: **`apps/builder`**
   - Env: copiar de `apps/builder/vercel-env.import.env.example` (CRM + provisioner em produção)
   - Depois do 1º deploy: no **provisioner** Vercel, `BUILDER_URL` e `CORS_ORIGINS` = URL do builder

Cada pasta já contém `vercel.json` com install/build no monorepo (`pnpm install` na raiz + `--filter` no pacote certo).

## Branches → ambiente

| Git | Landing | CRM | Builder |
|-----|---------|-----|---------|
| `main` | Produção `ascendclub.com.br` | Produção `crm.*` | Produção builder |
| `feature/*` | Preview da branch | Preview da branch | Preview da branch |
| Pull Request | Preview do PR | Preview do PR | Preview do PR |

Configuração padrão Vercel: **Production Branch** = `main`; previews automáticos em PR e branches ligadas ao projeto.

## Variáveis de ambiente (por projeto)

### `ascend-landing` (`apps/landing`)

| Variável | Produção | Preview |
|----------|----------|---------|
| `NEXT_PUBLIC_APP_URL` | `https://ascendclub.com.br` | URL automática do preview Vercel |
| `NEXT_PUBLIC_SUPABASE_URL` | igual CRM | igual |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | igual CRM | igual |
| `SUPABASE_SERVICE_ROLE_KEY` | secret | secret |
| `HASH_SALT` | secret | secret (pode ser outro em preview) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | opcional | opcional |

### `ascend-crm` (`apps/crm`)

| Variável | Produção | Preview |
|----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://tcolzuozekujmqlpwdkv.supabase.co` (seu projeto) | igual |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | chave **anon** / **publishable** do Supabase | igual |
| `SUPABASE_SERVICE_ROLE_KEY` | chave **service_role** (não use a anon aqui) | secret |
| `HASH_SALT` | string longa aleatória | secret |
| `BUILDER_API_KEY` | … | … |

**Importante:** são **dois projetos Vercel** no mesmo repo. Env da landing **não** vale para o CRM. Se `/login?error=config`, faltam as `NEXT_PUBLIC_*` no projeto **ascend-crm** ou falta **Redeploy** depois de salvar as env (elas entram no build do Next).

Use **Environment** na Vercel: Production / Preview / Development para não vazar secrets em preview se não quiser.

## Domínios

- **Landing:** `ascendclub.com.br` + redirect `www` → apex (ou o inverso, como preferir).
- **CRM:** subdomínio interno, ex. `crm.ascendclub.com.br` — não apontar o apex do marketing para o CRM.

## Comandos locais (espelham o build da Vercel)

```bash
pnpm install
pnpm --filter @crm-ascend/landing build
pnpm --filter @crm-ascend/crm build
pnpm --filter @crm-ascend/builder build
```

### `ascend-builder` (`apps/builder`)

| Variável | Valor (produção) |
|----------|------------------|
| `CRM_URL` / `NEXT_PUBLIC_CRM_URL` | `https://crm-ascend-2c1l.vercel.app` |
| `PROVISIONER_URL` / `NEXT_PUBLIC_PROVISIONER_URL` | `https://ascend-nuvemshop-provisioner-api.vercel.app` |

Ver também [`builder-nuvemshop-integration.md`](../builder-nuvemshop-integration.md).

## Fluxo de trabalho sugerido

1. `git checkout -b feature/nome`
2. Commit + push → Vercel gera **duas** previews (uma por projeto, se ambos estiverem ligados ao repo).
3. Abrir PR → previews atualizadas nos comentários do PR.
4. Merge em `main` → deploy produção nos dois projetos.

## Monorepo

- `pnpm-workspace.yaml` na raiz; pacotes compartilhados: `@crm-ascend/db`, `@crm-ascend/validation`.
- Turbo (`turbo.json`) orquestra `build` / `dev` / `lint` em CI local; na Vercel cada app usa o `vercel.json` local com `--filter`.
