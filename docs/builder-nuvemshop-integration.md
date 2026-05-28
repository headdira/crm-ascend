# Builder ↔ Nuvemshop Provisioner

## Repositórios

| Repo | Função |
|------|--------|
| `crm-ascend` | Builder (`:3002`), CRM (`:3001`), `storefront-config`, `ascend-vitrine.js` |
| `ascend-nuvemshop-provisioner` | OAuth, jobs, **POST /scripts** — deploy Vercel (`apps/api`) |
| `ascend-nuvemshop-provisioner/apps/catalog-api` | Produtos por nicho (`:4011`) |

## Vitrine: só API Scripts (sem CLI)

Não usamos `nuvemshop theme create`, fork Toluca/Ipanema nem `theme authorize`.

Fluxo:

1. Wizard → PNGs no Supabase + `theme_assets` no CRM  
2. `POST https://api.nuvemshop.com.br/2025-03/{store_id}/scripts` com `script_id` + `query_params.configUrl`  
3. Na loja carrega `ascend-vitrine.js` → `fetch(configUrl)` → injeta logo, banners e CSS de cores  

Arquivo do script: [`apps/crm/public/ascend-vitrine.js`](../apps/crm/public/ascend-vitrine.js)  
Config JSON: `GET {CRM_PUBLIC_URL}/api/builder/storefront-config?submission_id=...`

Funciona com **qualquer tema** já instalado (ex. Toluca) — não mexe em arquivos do tema.

## Env provisioner

```env
NUVEMSHOP_SCRIPT_ID=6970
CRM_PUBLIC_URL=https://crm.seudominio.com   # HTTPS, não localhost
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Env CRM

```env
PROVISIONER_API_URL=http://localhost:4010
PROVISIONER_API_KEY=dev-provisioner-key
CRM_WEBHOOK_SECRET=dev-secret
```

## Partner Portal — Scripts

1. App com scope **write_scripts**  
2. Criar script **store**, evento `onfirstinteraction` (padrão)  
3. Upload do conteúdo de `ascend-vitrine.js` (ou URL estável: `{CRM}/ascend-vitrine.js`)  
4. **Não auto-install** → o job chama `POST /scripts` em cada instalação  
5. Script **ascend-vitrine** (id `6970`) → `NUVEMSHOP_SCRIPT_ID=6970`

Doc: [`nuvemshop-api-recursos-ecommerce-ascend.md`](./nuvemshop-api-recursos-ecommerce-ascend.md)

## Deploy Builder (Vercel)

1. Novo projeto no mesmo repo `crm-ascend` → **Root Directory:** `apps/builder`
2. Importar env de `apps/builder/vercel-env.import.env.example`
3. Deploy → URL pública (ex. `https://ascend-builder.vercel.app`)
4. No **provisioner** (Vercel): `BUILDER_URL` + `CORS_ORIGINS` = URL do builder

## Fluxo local

```bash
# Catalog
cd ../ascend-nuvemshop-provisioner && pnpm dev:catalog

# Provisioner
cp .env.example .env
pnpm dev

# CRM + Builder
cd crm-ascend
pnpm --filter @crm-ascend/crm dev
pnpm --filter @crm-ascend/builder dev
```

Redirect OAuth: `https://ascend-nuvemshop-provisioner-api.vercel.app/oauth/callback`

## Catálogo

`GET http://localhost:4011/v1/niches/pet/products`
