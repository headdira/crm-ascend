# Nuvemshop API — recursos de e-commerce e utilidade para o Ascend

> **Status:** documentação de referência. **Sem implementação planejada** para a maioria dos itens abaixo, exceto o que já está em produção no provisioner (produtos, categorias, scripts Nube).
>
> Versão da API: **2025-03**. Espelhos locais em [`docs/tiendanube-api/`](./tiendanube-api/).  
> Visão geral por loja: [`intro.md`](./tiendanube-api/intro.md) · OAuth: [`authentication.md`](./tiendanube-api/authentication.md) · Pages: [`nuvemshop-pages-e-ecommerce-completo.md`](./nuvemshop-pages-e-ecommerce-completo.md).

---

## Mapa rápido: o que importa para o Ascend

| Recurso | Escrita via API? | Ajuda o Ascend? | Prioridade |
|---------|------------------|-----------------|------------|
| **Products** | Sim | Catálogo por nicho no provisionamento | **Alta** (já usado) |
| **Categories** | Sim | Organizar vitrine / import | **Alta** (já usado) |
| **Scripts** | `POST /{store_id}/scripts` + JS na vitrine | **Único caminho Ascend** — logo/banners/cores (`ascend-vitrine.js`) | **Alta** (em uso) |
| **CLI tema** | `theme create/pull/push` | Fork Ipanema/Toluca | **Não usado** no Ascend |
| **Pages** | Sim (`write_content`) | Institucional / SEO | Baixa (doc separada; gap no `upsertPage`) |
| **Kit** | **Somente leitura** (`GET`) | Bundles montados no admin | Baixa |
| **Checkout SDK / Payment Provider** | App de pagamento parceiro | Só se Ascend virar gateway | Não aplicável hoje |
| **Cart** | Limitado | Apps de carrinho / suporte | Não aplicável hoje |
| **Abandoned Checkout** | Cupom em carrinho abandonado | Recuperação de vendas (futuro CRM) | Futuro |

---

## 1. Kit (bundles)

**Doc:** [`tiendanube-api/resources/kit.md`](./tiendanube-api/resources/kit.md)

### O que é

- Produto que **agrupa outros produtos** como componentes (kit/combo).
- Preço = soma dos componentes, com desconto `%` opcional.
- Estoque (`kit_stock`) = mínimo entre componentes (ex.: 2×A + 1×B → limitado pelo que acabar primeiro).
- Só produtos com **uma variante** podem ser componentes.

### API

- **Read-only:** `GET /kits/{id}` (mesmo `id` do produto kit).
- Criação/edição: **painel admin** da loja, não API pública.

### O que ajuda o Ascend

| Ajuda? | Como |
|--------|------|
| Pouco no provisionamento automático | Não dá para criar kits pelo job atual; importamos **produtos simples** do catálogo. |
| Consulta / suporte | Ler kit existente para debug ou exibir composição no CRM. |
| Futuro | Oferta “combo nicho” exigiria processo manual no admin ou outro produto Nuvemshop (não Kit API). |

**Conclusão:** documentar para não confundir com “criar pacote via API”. Para Ascend Builder, foco continua em **produtos individuais**.

---

## 2. Scripts (vitrine e checkout)

**Doc:** [`tiendanube-api/resources/script.md`](./tiendanube-api/resources/script.md)

### O que é

- JS do **app parceiro** injetado na **vitrine** (`store`) e/ou **checkout**.
- Cadastro no **Partner Portal** (handle, location, event `onfirstinteraction` | `onload`, versões, deploy).
- Scope **`write_scripts`** na instalação do app.
- Objeto global **`LS`** (loja, carrinho, tema, produto, categoria, etc.) no contexto da página.

### Fluxo típico

1. Partner cria script + sobe `.js` (versões draft → test → active).
2. **Auto-install:** carrega em todas as lojas com o app instalado.
3. **Não auto-install:** após instalar o app, chamar API para **associar** script à loja:

```http
POST https://api.nuvemshop.com.br/2025-03/{store_id}/scripts
Authentication: bearer {access_token_da_loja}
Content-Type: application/json

{
  "script_id": 12345,
  "query_params": "{\"configUrl\":\"https://...\"}"
}
```

Mesmo sem parâmetros, a associação é o “consentimento” para a Nuvemshop carregar o script.

### O que o Ascend usa (Scripts API)

| Peça | Onde |
|------|------|
| JS na vitrine | `apps/crm/public/ascend-vitrine.js` (IIFE, doc Scripts) |
| Config por loja | `GET /api/builder/storefront-config?submission_id=` |
| Associar script | `apply-storefront.ts` → `POST …/scripts` |
| PNGs | Supabase `builder-theme` + `theme_assets` |

**Não** usamos CLI nem fork de tema. Toluca (ou outro) permanece como está; o script injeta bloco no topo + CSS.

**Regras (doc Scripts):** scope `write_scripts`, IIFE, `query_params` na URL do `.js`, associar loja após instalar o app.

---

## 3. Checkout SDK e Payment Provider (checkout)

**Docs:** [`checkout_sdk.md`](./tiendanube-api/resources/checkout_sdk.md) · [`checkout.md`](./tiendanube-api/resources/checkout.md) · [`payment-provider.md`](./tiendanube-api/guides/payment-provider.md)

### O que é

- **`window.SDKCheckout`:** customizar checkout (esconder gateways, texto de benefício, parcelas, eventos `LINE_ITEMS_UPDATED`).
- **`LoadCheckoutPaymentContext`:** para **apps de meio de pagamento** (redirect, cartão transparente, modal, PIX, boleto, etc.) com `Checkout.processPayment` (v2, backend-to-backend).

### O que ajuda o Ascend

| Ajuda? | Motivo |
|--------|--------|
| **Não** no fluxo atual | Ascend não é payment provider; a loja usa gateways nativos (Mercado Pago, etc.). |
| Só se produto mudar | Ascend como app de pagamento homologado na Nuvemshop. |

**Conclusão:** e-commerce “completo” no sentido **pagar e fechar pedido** já é da plataforma; esta doc é para **parceiros de pagamento**, não para o builder de vitrine.

---

## 4. Categories

**Doc:** [`tiendanube-api/resources/category.md`](./tiendanube-api/resources/category.md)

### O que é

- Árvore de categorias da loja; `visibility` (`visible`, `hidden`, `soft-hidden`).
- CRUD: `GET/POST/PUT/DELETE /categories`.
- Produtos ligam categorias via `PUT /products/{id}` → `"categories": [1234, 4567]`.

### O que ajuda o Ascend

| Ajuda? | Como |
|--------|------|
| **Sim** | `ensureCategory` / `createCategory` no `@ascend/nuvemshop-rest`; handles do catálogo por nicho. |

**Conclusão:** já parte do provisionamento de catálogo.

---

## 5. Cart

**Doc:** [`tiendanube-api/resources/cart.md`](./tiendanube-api/resources/cart.md)

### O que é

- Manipular carrinhos **ainda abertos** (`GET /carts/{id}`, remover line item, remover cupom).
- Carrinho convertido em pedido ou em checkout redirect **não** é mais acessível por esta API.
- Scopes: `read_orders` / `write_orders`.

### O que ajuda o Ascend

| Ajuda? | Motivo |
|--------|--------|
| Baixo hoje | Builder/provisioner não opera carrinho em tempo real. |
| Futuro | Apps de suporte, automação, integrações CRM pós-venda. |

---

## 6. Abandoned Checkout

**Doc:** [`tiendanube-api/resources/abandoned-checkout.md`](./tiendanube-api/resources/abandoned-checkout.md)

### O que é

- Carrinho abandonado após **2º passo** do checkout.
- `GET /checkouts`, `GET /checkouts/{id}`, `POST /checkouts/{cart_id}/coupon`.
- Janela de acesso ~30 dias; conversão em pedido ainda possível depois.

### O que ajuda o Ascend

| Ajuda? | Motivo |
|--------|--------|
| Futuro / CRM | Campanhas de recuperação, cupom automático, lista no CRM. |
| Não no provisionamento | Não cria loja nem vitrine. |

Combina bem com **Scripts** (popup de carrinho abandonado) em app parceiro dedicado — fora do escopo atual.

---

## E-commerce completo: camadas

```text
┌─────────────────────────────────────────────────────────────┐
│  Plataforma Nuvemshop (nativo)                              │
│  Checkout · Pagamentos · Frete · Pedidos · Estoque multi    │
└─────────────────────────────────────────────────────────────┘
                              ▲
┌─────────────────────────────────────────────────────────────┐
│  API por loja (OAuth access_token + store_id)               │
│  Products · Categories · Pages · Scripts assoc. · Store     │
└─────────────────────────────────────────────────────────────┘
                              ▲
┌─────────────────────────────────────────────────────────────┐
│  Ascend                                                     │
│  Builder → submission → Provisioner → catálogo + visual     │
└─────────────────────────────────────────────────────────────┘
```

| Camada Ascend | APIs / ferramentas |
|---------------|-------------------|
| Catálogo inicial | Products, Categories |
| Visual vitrine (preferido sem CLI) | **Scripts** + NubeSDK + assets CRM |
| Visual vitrine (alternativa) | Tema / CLI Ipanema — ver [`builder-nuvemshop-integration.md`](./builder-nuvemshop-integration.md) |
| Conteúdo estático | Pages (futuro) |
| Pós-venda / marketing | Abandoned Checkout, Cart (futuro) |
| Pagamento customizado | Checkout SDK / Payment Provider (não escopo) |
| Combos | Kit (somente leitura; admin manual) |

---

## Estado no código (provisioner)

| Recurso | Código |
|---------|--------|
| Products / Categories | `packages/nuvemshop-rest/src/index.ts` |
| Scripts (associação) | `packages/nuvemshop-storefront/src/apply-storefront.ts` |
| Pages | `upsertPage` (payload legado — ver doc Pages) |
| Kit, Cart, Abandoned Checkout, Checkout SDK | Não implementado |

---

## Links oficiais

| Recurso | URL |
|---------|-----|
| Kit | https://tiendanube.github.io/api-documentation/resources/kit |
| Scripts | https://tiendanube.github.io/api-documentation/resources/script |
| Checkout SDK | https://tiendanube.github.io/api-documentation/resources/checkout_sdk |
| Category | https://tiendanube.github.io/api-documentation/resources/category |
| Cart | https://tiendanube.github.io/api-documentation/resources/cart |
| Abandoned Checkout | https://tiendanube.github.io/api-documentation/resources/abandoned-checkout |
| Pages | https://tiendanube.github.io/api-documentation/resources/page |

---

## Histórico

| Data | Nota |
|------|------|
| 2026-05-25 | Doc criada (Kit, Scripts, Checkout, Categories, Cart, Abandoned Checkout) com mapa de utilidade Ascend; sem implementação nova. |
