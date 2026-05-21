# CRM Ascend — Monorepo

Implementação Fase 1 do CRM interno Ascend.

## Estrutura

```
apps/landing/          # Next.js — landing pública (deploy próprio, porta 3000)
apps/crm/              # Next.js — CRM interno (deploy próprio, porta 3001)
packages/db/           # Cliente Supabase tipado
packages/validation/   # Zod + hashIdentifier
supabase/migrations/   # Schema único
docs/crm/              # INDEX + API examples
docs/brand/            # Manual da marca + ícones (IA)
agents/                # Specs agentc (ex.: ascend-brand)
```

## Comandos

| Comando | Descrição |
|--------|-----------|
| `pnpm install` | Instala dependências |
| `pnpm --filter @crm-ascend/landing dev` | Landing pública (porta 3000) |
| `pnpm --filter @crm-ascend/crm dev` | CRM interno (porta 3001) |
| `pnpm --filter @crm-ascend/validation test` | Testes Zod/hash |
| `pnpm build` | Build turbo (todos os pacotes) |

**Deploy (GitFlow + Vercel):** dois projetos Vercel — [`docs/deploy/vercel-gitflow.md`](docs/deploy/vercel-gitflow.md) (`apps/landing` → ascendclub.com.br, `apps/crm` → subdomínio interno).

Documentação mestre: [`docs/crm/INDEX.md`](docs/crm/INDEX.md) (copie o prompt técnico completo para este arquivo se ainda não existir).

**Manual da marca:** [`docs/brand/README.md`](docs/brand/README.md) — paleta, ícones, tom de voz, componentes e regras de aplicação. Agente compilado: `ascend-brand` (ver seção 11 do manual).
