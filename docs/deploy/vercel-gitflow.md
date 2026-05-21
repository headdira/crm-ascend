# Deploy — GitFlow + Vercel (landing e CRM separados)

Dois projetos Vercel no **mesmo repositório**, com **Root Directory** diferente. Pipeline nativo da Vercel (zero config extra no repo além dos `vercel.json` em cada app).

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

Cada pasta já contém `vercel.json` com install/build no monorepo (`pnpm install` na raiz + `--filter` no pacote certo).

## Branches → ambiente

| Git | Landing | CRM |
|-----|---------|-----|
| `main` | Produção `ascendclub.com.br` | Produção `crm.*` |
| `feature/*` | Preview da branch | Preview da branch |
| Pull Request | Preview do PR (URL única) | Preview do PR |

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
| `NEXT_PUBLIC_SUPABASE_URL` | … | … |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | … | … |
| `SUPABASE_SERVICE_ROLE_KEY` | … | … |
| `HASH_SALT` | … | … |
| `BUILDER_API_KEY` | … | … |

Use **Environment** na Vercel: Production / Preview / Development para não vazar secrets em preview se não quiser.

## Domínios

- **Landing:** `ascendclub.com.br` + redirect `www` → apex (ou o inverso, como preferir).
- **CRM:** subdomínio interno, ex. `crm.ascendclub.com.br` — não apontar o apex do marketing para o CRM.

## Comandos locais (espelham o build da Vercel)

```bash
pnpm install
pnpm --filter @crm-ascend/landing build
pnpm --filter @crm-ascend/crm build
```

## Fluxo de trabalho sugerido

1. `git checkout -b feature/nome`
2. Commit + push → Vercel gera **duas** previews (uma por projeto, se ambos estiverem ligados ao repo).
3. Abrir PR → previews atualizadas nos comentários do PR.
4. Merge em `main` → deploy produção nos dois projetos.

## Monorepo

- `pnpm-workspace.yaml` na raiz; pacotes compartilhados: `@crm-ascend/db`, `@crm-ascend/validation`.
- Turbo (`turbo.json`) orquestra `build` / `dev` / `lint` em CI local; na Vercel cada app usa o `vercel.json` local com `--filter`.
