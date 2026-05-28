# Nuvemshop — API de Pages e e-commerce completo (referência)

> **Status:** documentação de referência apenas. **Não há trabalho planejado** neste sentido por enquanto (sem alteração de código no provisioner nem no catálogo até nova decisão).
>
> Espelho da API: [`docs/tiendanube-api/resources/page.md`](./tiendanube-api/resources/page.md) (versão **2025-03**).  
> Doc oficial: [Pages — Tiendanube API](https://tiendanube.github.io/api-documentation/resources/page).

---

## O que a API de Pages faz

A resource **Pages** gerencia **páginas customizadas** na loja (conteúdo institucional / landing), com suporte a **vários idiomas**.

- Cada página tem slug (`handle`), título (`name`), HTML (`content`) e campos de SEO, por locale.
- Hoje, na API **2025-03**, página criada tende a ficar **publicada** (visível na loja).
- URLs típicas na vitrine: `https://minhaloja.com.br/sobre`, `/politica-de-privacidade`, etc.

**Permissões OAuth:**

| Operação | Scope |
|----------|--------|
| Listar / ler | `read_content` |
| Criar / editar / apagar | `write_content` |

**Autenticação:** modo **por loja** (não Partner-Action):

- `GET/POST/PUT/DELETE` → `https://api.nuvemshop.com.br/2025-03/{store_id}/pages`
- Header: `Authentication: bearer {access_token}` + `User-Agent`
- Ver [`docs/tiendanube-api/authentication.md`](./tiendanube-api/authentication.md) e [`docs/tiendanube-api/intro.md`](./tiendanube-api/intro.md).

---

## Endpoints (resumo 2025-03)

### Listar

`GET /pages` → resposta paginada:

```json
{
  "pages": {
    "results": [ { "id": 105034, "name": { "pt": "Sobre" }, "handle": { "pt": "sobre" }, ... } ],
    "total": 17,
    "page": 1,
    "perPage": 5,
    "lastPage": 4
  }
}
```

### Ler uma

`GET /pages/:pageID`

### Criar

`POST /pages` — body **2025-03**:

```json
{
  "page": {
    "publish": true,
    "i18n": {
      "pt_BR": {
        "title": "Sobre nós",
        "content": "<p>HTML da página</p>",
        "seo_handle": "sobre",
        "seo_title": "Sobre nós",
        "seo_description": "Conheça nossa história"
      }
    }
  }
}
```

Chaves de idioma seguem o padrão da loja (ex.: `pt_BR`, `es_AR`, `en_US`).

### Atualizar

`PUT /pages/:pageID` — na doc atual, exemplo de body **simples** (um idioma):

```json
{
  "title": "Sobre nós (atualizado)",
  "content": "<p>Conteúdo atualizado</p>"
}
```

(Resposta continua com objetos localizados `name`, `handle`, `content`, etc.)

### Apagar

`DELETE /pages/:pageID` → `{ "message": "Page deleted successfully." }`

---

## O que Pages **não** cobre (e-commerce completo)

Pages é só a camada de **conteúdo estático**. Para loja “completa” na Nuvemshop, o restante vem de outros recursos ou da própria plataforma:

| Necessidade | API / produto | No Ascend hoje |
|-------------|---------------|----------------|
| Produtos, variantes, imagens, estoque | **Products**, **Categories** | Provisioner (`@ascend/nuvemshop-rest`) + catalog-api |
| Carrinho, checkout, pagamento, pedidos | Plataforma Nuvemshop + APIs **Order**, **Cart**, etc. | Não reimplementar — loja nativa |
| Visual da vitrine (home, logo, banners) | Tema / **Scripts** (Nube) / instalação de tema | Provisioner (`storefrontMode`, tema) — ver [`builder-nuvemshop-integration.md`](./builder-nuvemshop-integration.md) |
| Páginas institucionais / landing HTML | **Pages** | Código existe; ver gap abaixo |
| Blog | **Blog** | Não usado |
| App no admin (wizard integrado) | [App templates](https://dev.nuvemshop.com.br/docs/developer-tools/templates) | Fora do escopo atual |

**Conclusão:** Pages **ajuda** a publicar textos legais, “quem somos”, landings por nicho — **não substitui** catálogo nem checkout.

---

## Papel no fluxo Ascend (visão futura)

Quando for priorizado, o encaixe natural é:

1. Cliente conclui o **builder** (nicho, cores, textos).
2. **Provisioner** já importa produtos do catálogo.
3. **Opcional:** criar/atualizar páginas a partir de `nicheCatalog.pages` (ex.: Sobre, Política de privacidade, Como comprar) com HTML gerado ou templates por nicho.

Isso complementa produtos + tema/scripts; não dispensa OAuth nem scopes `write_content` no app do Partner Portal.

---

## Estado atual do código (provisioner)

Repositório: `ascend-nuvemshop-provisioner`.

| Peça | Situação |
|------|----------|
| `packages/provisioner-core/src/run-job.ts` | Se o catálogo tiver `pages[]`, chama `ns.upsertPage(page)` após produtos |
| `packages/nuvemshop-rest/src/index.ts` → `upsertPage` | Implementação **legada**: envia `name`, `handle`, `content` no root do POST; busca com `GET /pages?handle=...` (formato de listagem **2025-03** ok) |

**Gap documentado (não corrigir por hora):**

- **POST** deveria usar `page.publish` + `page.i18n` com `title`, `content`, `seo_handle`, etc., conforme API 2025-03.
- **PUT** na doc usa `title` / `content` simples; o client hoje manda payload no formato antigo de objetos localizados — validar na hora da implementação contra a loja de teste.

Até alinhar o payload, páginas do catálogo podem falhar silenciosamente ou retornar erro da API — tratar como **não confiável em produção**.

---

## Catálogo

Definição de páginas por nicho (quando existir) fica no **catalog-api** / JSON de nicho no provisioner (`nicheCatalog.pages`). Hoje o foco operacional do time está em **produtos + tema/visual**, não em expandir `pages` no catálogo.

---

## Autenticação (lembrete)

- **Pages por loja:** `access_token` OAuth da instalação + `store_id` (`user_id` no token).
- **Partner-Action** (`/apps/{app_id}/...` com client secret): **não** se aplica a Pages. Ver [`docs/tiendanube-api/guides/authentication-for-partner-actions.md`](./tiendanube-api/guides/authentication-for-partner-actions.md).

---

## Outros recursos (Kit, Scripts, Checkout, …)

Mapa completo e “o que nos ajuda”: [`nuvemshop-api-recursos-ecommerce-ascend.md`](./nuvemshop-api-recursos-ecommerce-ascend.md).

## Links úteis

| Assunto | Link |
|---------|------|
| Pages (oficial) | https://tiendanube.github.io/api-documentation/resources/page |
| Intro / requests por loja | https://tiendanube.github.io/api-documentation/intro |
| OAuth | https://tiendanube.github.io/api-documentation/authentication |
| Integração Builder local | [`builder-nuvemshop-integration.md`](./builder-nuvemshop-integration.md) |
| App templates (admin) | https://dev.nuvemshop.com.br/docs/developer-tools/templates |

---

## Histórico

| Data | Nota |
|------|------|
| 2026-05-25 | Doc criada após alinhamento: Pages útil para conteúdo institucional; e-commerce completo = produtos + plataforma + tema/scripts; sem implementação imediata. |
