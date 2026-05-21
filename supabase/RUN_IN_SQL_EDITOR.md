# Supabase — rodar migrations na ordem

Se `006` falhou com **`relation "leads" does not exist`**, o projeto ainda não tem o schema do CRM.

No **SQL Editor** do dashboard, rode **um arquivo por vez**, nesta ordem:

| # | Arquivo |
|---|---------|
| 1 | `migrations/001_init_enums.sql` |
| 2 | `migrations/002_core_tables.sql` |
| 3 | `migrations/003_form_tables.sql` |
| 4 | `migrations/004_rls_policies.sql` |
| 5 | `migrations/005_seed_products_services.sql` *(opcional)* |
| 6 | `migrations/006_landing_tracking.sql` |

Ou cole tudo de uma vez: **`bootstrap_full_schema.sql`** (na mesma pasta).

## Se você já rodou a `006` pela metade

Antes de rodar de novo:

```sql
DROP TABLE IF EXISTS landing_events CASCADE;
DROP TABLE IF EXISTS landing_sessions CASCADE;
```

Depois rode só a `006` (com `leads` já existindo).

## Conferir

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name IN ('leads', 'landing_sessions', 'landing_events');
```

Deve retornar as 3 linhas.
