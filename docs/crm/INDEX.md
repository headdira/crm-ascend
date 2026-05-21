# CRM Ascend — INDEX (Fase 1)

Documento-mestre do escopo CRM interno. A implementação neste repositório segue os epics A–G do INDEX original.

## Referência rápida

| Área | Caminho |
|------|---------|
| App Next.js | `apps/crm/` |
| Migrations | `supabase/migrations/` |
| Tipos + clientes DB | `packages/db/` |
| Zod + hashes | `packages/validation/` |
| APIs builder | `apps/crm/src/app/api/crm/` |
| Setup local | `apps/crm/README.md` |
| Exemplos curl | `docs/crm/api-examples.md` |

## Critérios de aceite (resumo)

1. Login staff + rotas `/crm/*` protegidas  
2. Leads com conversão sem duplicar `email_hash`  
3. Catálogo com seeds `CURSO-BASE` / `MENT-1:1`  
4. Contrato draft → ativo gera `enrollments`  
5. Casos manuais + `form-submit` com `open_case`  
6. `validate-student` sem PII em claro  
7. `validate-eligibility` com `REQUIRES_ACTIVE_COURSE`  
8. UI shadcn + ícones Lucide  
9. RLS + service role apenas no servidor  

Para o texto completo do INDEX (negócio, schema, backlog), use o prompt técnico fornecido no kickoff do projeto ou mantenha uma cópia canônica neste arquivo.
