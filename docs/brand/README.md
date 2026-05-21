# Manual da Marca — Ascend Club

> **Versão:** 1.0.0 · **Última atualização:** maio/2026  
> **Fonte de verdade visual:** landing em `apps/crm/src/app/(sales)/` e tokens em `apps/crm/src/app/globals.css` (classe `.sales-landing`).

Este manual traduz a experiência da landing em diretrizes aplicáveis por designers, devs, copywriters e agentes de IA. O objetivo é que **qualquer touchpoint** — site, CRM, e-mail, social, suporte — soe e pareça **Ascend**: premium, direto, energético e focado em resultado.

---

## Sumário

1. [Essência da marca](#1-essência-da-marca)
2. [Paleta de cores](#2-paleta-de-cores)
3. [Tipografia](#3-tipografia)
4. [Biblioteca de ícones](#4-biblioteca-de-ícones)
5. [Tom de voz e microcopy](#5-tom-de-voz-e-microcopy)
6. [Requisitos de aplicação da marca](#6-requisitos-de-aplicação-da-marca)
7. [Sistema de componentes (exemplos)](#7-sistema-de-componentes-exemplos)
8. [Padrões de UX](#8-padrões-de-ux)
9. [Do's & Don'ts](#9-dos--donts)
10. [Assets oficiais](#10-assets-oficiais)
11. [Agente de marca (agentc)](#11-agente-de-marca-agentc)

---

## 1. Essência da marca

| Dimensão | Definição |
|----------|-----------|
| **Nome** | Ascend Club |
| **Promessa** | Mentoria em grupo para iniciantes construírem renda online no Brasil, com suporte próximo, networking e calls ao vivo. |
| **Público** | Iniciantes no digital que buscam método, comunidade e acompanhamento — não apenas curso gravado. |
| **Personalidade** | Confiante · Direta · Aspiracional · Urgente (com ética) · Premium acessível |
| **Metáfora visual** | **Subir / decolar** — ouro como energia, preto como palco, vermelho só para escassez real |

### Proposta de valor (uma frase)

> *Tenha o passo a passo, suporte próximo, networking ativo e estratégias aplicadas por alunos que já faturam no digital.*

### O que a marca **não** é

- Não é corporativo frio (banco/consultoria tradicional).
- Não é “curso barato” com visual amador.
- Não é hype vazio: números e depoimentos devem ser defensáveis.

---

## 2. Paleta de cores

### 2.1 Cores primárias (landing / marketing)

| Token | HEX | RGB | Uso |
|-------|-----|-----|-----|
| **Ascend Gold** | `#FFB800` | `255, 184, 0` | CTAs, destaques, preço, ícones ativos, glow |
| **Ascend Black** | `#0A0A0A` | `10, 10, 10` | Fundo principal da landing |
| **Ascend Snow** | `#FAFAFA` | `250, 250, 250` | Texto principal sobre fundo escuro |
| **Surface Elevated** | `#111111` | `17, 17, 17` | Cards de pricing, blocos elevados |
| **Surface Deep** | `#0D0D0D` | `13, 13, 13` | Seções alternadas |

### 2.2 Cores de suporte

| Token | HEX | Uso |
|-------|-----|-----|
| **Urgency Red** | `#DC2626` (`red-600`) | Faixas de escassez (“vagas limitadas”) — **uso moderado** |
| **Red Muted** | `red-400` / `red-500/10` | Badges de tempo limitado |
| **White / 65%** | `rgba(255,255,255,0.65)` | Parágrafos de apoio |
| **White / 35%** | `rgba(255,255,255,0.35)` | Metadados, legendas |
| **White / 5–8%** | bordas `white/5`, `white/8` | Cards sutis, divisores |
| **Gold / 10–30%** | `primary/10`, `primary/20` | Badges, halos, bordas de destaque |

### 2.3 Efeitos de cor (obrigatórios na landing)

```css
/* Glow primário — botões e preço */
shadow-[0_0_50px_rgba(255,184,0,0.3)]
drop-shadow-[0_0_30px_rgba(255,184,0,0.35)]

/* Halo de seção */
bg-[radial-gradient(circle_at_center,rgba(255,184,0,0.12),transparent_45%)]

/* Hover em CTA */
hover:brightness-110
```

### 2.4 Contraste e acessibilidade

| Combinação | WCAG aprox. | Status |
|------------|-------------|--------|
| `#FFB800` sobre `#0A0A0A` | AA grande | ✅ Títulos, botões |
| `#FAFAFA` sobre `#0A0A0A` | AAA | ✅ Corpo |
| `#0A0A0A` sobre `#FFB800` | AAA | ✅ Texto em CTA |
| `white/35` sobre `#0A0A0A` | AA | ⚠️ Apenas texto secundário, nunca CTA |

### 2.5 CRM (app interno)

O CRM usa tokens **shadcn** em `globals.css` (modo claro/escuro). Na comunicação **externa** ao aluno, priorize a paleta da landing. No CRM, use primary escuro/neutro; reserve ouro para momentos de celebração ou links para a comunidade.

```css
/* Escopo landing — apps/crm/src/app/globals.css */
.sales-landing {
  --primary: #ffb800;
  --primary-foreground: #0a0a0a;
  --background: #0a0a0a;
  --foreground: #fafafa;
}
```

---

## 3. Tipografia

| Papel | Família | Peso | Estilo |
|-------|---------|------|--------|
| **UI / Marketing** | Inter (`font-inter`) | 400–900 | Principal em toda a landing |
| **CRM (sistema)** | Geist + Inter | 400–600 | Formulários, tabelas |
| **Destaque hero** | Inter Black (`font-black`) | 900 | Headlines em `uppercase` |
| **Labels / tags** | Inter Bold | 700 | `uppercase`, `tracking-[0.2em]` a `tracking-[0.3em]` |

### Escala tipográfica (landing)

| Elemento | Classes de referência |
|----------|----------------------|
| H1 hero | `text-5xl sm:text-6xl lg:text-7xl font-black uppercase leading-[0.95]` |
| H2 seção | `text-4xl sm:text-5xl md:text-6xl font-black uppercase` |
| Eyebrow | `text-sm tracking-[0.3em] uppercase text-primary font-bold` |
| Corpo | `text-lg text-white/65 leading-relaxed` |
| Preço hero | `text-7xl font-black text-primary` |
| CTA | `text-lg xl:text-xl font-black uppercase tracking-wide` |
| Micro trust | `text-xs text-white/35` |

### Regras

1. Headlines de conversão: **sempre uppercase** na landing.
2. Nunca usar mais de **2 famílias** no mesmo ecrã de marketing.
3. Preço e CTA podem ser maiores que o corpo — hierarquia clara.

---

## 4. Biblioteca de ícones

### 4.1 Ícones gerados (marca Ascend)

Ícones em estilo **line gold on black**, gerados para consistência visual. Uso em app, slides, e-mails e materiais sociais.

| Arquivo | Conceito | Quando usar |
|---------|----------|-------------|
| [`icons/icon-ascend-arrow.png`](./icons/icon-ascend-arrow.png) | Seta ascendente | Logo mark, favicon alternativo, “subir de nível” |
| [`icons/icon-networking.png`](./icons/icon-networking.png) | Rede / comunidade | Grupo exclusivo, networking |
| [`icons/icon-growth.png`](./icons/icon-growth.png) | Gráfico em alta | Renda online, resultados |
| [`icons/icon-live-calls.png`](./icons/icon-live-calls.png) | Live / câmera | 2 calls semanais, mentoria ao vivo |
| [`icons/icon-trust.png`](./icons/icon-trust.png) | Escudo + check | Pagamento seguro, garantias |
| [`icons/icon-gamification.png`](./icons/icon-gamification.png) | Troféu | Brindes, progresso, gamificação |

### 4.2 Ícones Lucide (código — landing atual)

Na implementação React, use **lucide-react** com `text-primary` ou `text-white/35`:

| Contexto | Ícone Lucide |
|----------|--------------|
| Benefício confirmado | `CheckCircle`, `CheckCircle2` |
| CTA / navegação | `ArrowRight` |
| Prova social | `Star` (filled com `fill-primary`) |
| Urgência | `Flame`, `Clock`, `Clock3` |
| Confiança | `Shield`, `ShieldCheck` |
| Energia | `Zap` |

### 4.3 Regras da biblioteca

| Regra | Detalhe |
|-------|---------|
| Tamanho mínimo | 16px UI · 24px marketing · 48px+ hero/feature |
| Cor ativa | `#FFB800` ou classe `text-primary` |
| Cor inativa | `text-white/35` ou `text-white/50` |
| Stroke | Preferir ícones line; filled só em estrelas de rating |
| Não misturar | Evitar Font Awesome + Lucide + PNG no mesmo bloco |

### 4.4 Export para outros canais

- **PNG:** usar arquivos em `docs/brand/icons/` (fundo preto embutido).
- **SVG:** recriar paths a partir dos PNG para edição vetorial (recomendado para print).
- **Favicon:** derivar de `icon-ascend-arrow.png` em 32×32 e 180×180.

---

## 5. Tom de voz e microcopy

### 5.1 Personalidade verbal

| Atributo | Na prática |
|----------|------------|
| **Direto** | Frases curtas. Verbo no imperativo nos CTAs. |
| **Confiante** | “Método validado”, “resultado real” — com evidência. |
| **Próximo** | “Suporte próximo”, “acompanhamento real” — humaniza. |
| **Urgente** | Escassez só quando verdadeira (vagas, turma). |

### 5.2 Vocabulário preferido

- renda online · passo a passo · networking · calls ao vivo · comunidade · mentoria · do zero · suporte próximo · método validado · garantir vaga · transformar

### 5.3 Evitar

- jargão corporativo (“sinergia”, “stakeholder”)
- promessas absolutas sem contexto (“fique rico em 7 dias”)
- tom infantil ou memes que quebram premium

### 5.4 Exemplos de microcopy

| Contexto | ✅ Correto | ❌ Evitar |
|----------|-----------|----------|
| CTA principal | “Quero Entrar No Ascend Club” | “Clique aqui” |
| Urgência | “RESTAM APENAS 12 VAGAS…” (se real) | “ÚLTIMA CHANCE!!!” genérico |
| Preço | “R$197 · pagamento único · Menos de R$0,54/dia” | “Super desconto imperdível” |
| Confiança | “Pagamento 100% seguro · Acesso imediato” | Texto longo legalista no hero |
| FAQ | Resposta empática + diferencial (mentoria ≠ curso) | “Não sei, depende” |

---

## 6. Requisitos de aplicação da marca

### 6.1 Layout e grid

| Requisito | Valor |
|-----------|-------|
| Largura máxima conteúdo | `max-w-7xl` (hero/nav) · `max-w-6xl` (benefícios) · `max-w-4xl` (pricing) |
| Padding horizontal | `px-6` (mobile/desktop marketing) |
| Ritmo vertical seções | `py-24` padrão |
| Grid benefícios | `md:grid-cols-2` |
| Grid hero | `lg:grid-cols-2` |

### 6.2 Raio e bordas

| Elemento | Classe |
|----------|--------|
| CTA pill (nav) | `rounded-full` |
| CTA principal | `rounded-2xl` ou `rounded-xl` |
| Cards | `rounded-2xl` · `rounded-3xl` (pricing) |
| Imagens hero | `rounded-[28px]` |
| Badges | `rounded-full` com `border border-primary/20` |

### 6.3 Motion

| Contexto | Regra |
|----------|-------|
| Landing padrão | `framer-motion` — fade + slide suave (`duration: 0.4–0.7`) |
| `data-light="true"` | **Sem animação** — respeitar `prefers-reduced-motion` e performance |
| Ticker | Marquee 18s; desligado em light mode |
| Hover CTA | `brightness-110`, shine sweep no botão hero |

### 6.4 Fotografia e imagem

- Retratos de mentores: borda `border-primary/20`, sombra dourada leve.
- Provas (prints): `rounded-xl`, borda `white/7`, hover `border-primary/40`.
- Logo oficial: não distorcer; altura ~48px no nav.

### 6.5 SEO e dados estruturados

- Título padrão: `Ascend Club` / template `%s | Ascend Club`.
- Descrição alinhada a `SITE_DESCRIPTION` em `knowledge.ts`.

### 6.6 Checklist antes de publicar

- [ ] Fundo `#0A0A0A` ou superfície da paleta
- [ ] CTA primário em `#FFB800` com texto `#0A0A0A`
- [ ] Headline conversão em uppercase
- [ ] Glow dourado em elemento de destaque (preço ou CTA)
- [ ] Contraste de texto secundário ≥ `white/35`
- [ ] Logo e preço corretos (R$197 / R$497 riscado)
- [ ] Urgência vermelha apenas em faixa de escassez
- [ ] Ícones consistentes (Lucide ou biblioteca PNG)

---

## 7. Sistema de componentes (exemplos)

Exemplos extraídos da landing — use como **contrato visual** em novas telas.

### 7.1 Badge / eyebrow

```tsx
<div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2">
  <Star className="w-4 h-4 text-primary fill-primary" />
  <span className="text-primary uppercase tracking-[0.2em] text-[11px] font-bold">
    Método Validado + Comunidade Exclusiva
  </span>
</div>
```

### 7.2 CTA primário (conversão)

```tsx
<a
  href={CHECKOUT_URL}
  className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-primary px-10 py-6 text-black font-black uppercase tracking-wide text-lg hover:brightness-110 shadow-[0_0_50px_rgba(255,184,0,0.3)] transition-all"
>
  <span className="relative z-10">Quero Entrar No Ascend Club</span>
  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
</a>
```

### 7.3 Card de benefício

```tsx
<div className="flex items-start gap-4 p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-primary/30 transition-colors">
  <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
  <p className="text-white/80 text-sm leading-relaxed">{benefit}</p>
</div>
```

### 7.4 Card de estatística

```tsx
<div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 text-center">
  <p className="text-primary text-3xl font-black">500+</p>
  <p className="text-white/35 uppercase tracking-widest text-[10px] mt-2">Alunos</p>
</div>
```

### 7.5 Faixa de urgência

```tsx
<div className="bg-red-600 border-b border-red-500">
  <p className="text-white font-black uppercase tracking-wide text-[11px] sm:text-sm text-center py-2">
    ⚠️ RESTAM APENAS 12 VAGAS DISPONÍVEIS PARA ESSA TURMA
  </p>
</div>
```

### 7.6 Card flutuante (prova no hero)

```tsx
<div className="bg-black/90 border border-primary/20 rounded-2xl px-5 py-4 backdrop-blur-xl shadow-2xl">
  <p className="text-primary text-xs uppercase tracking-widest font-bold mb-1">Resultado Real</p>
  <h3 className="text-white font-black text-2xl">+500 alunos</h3>
  <p className="text-white/45 text-xs mt-1">aplicando o método Ascend</p>
</div>
```

### 7.7 Bloco de preço

```tsx
<div>
  <p className="text-white/25 line-through text-lg font-medium">De R$497</p>
  <p className="text-primary font-black text-7xl leading-none drop-shadow-[0_0_25px_rgba(255,184,0,0.35)]">
    R$197
  </p>
  <p className="text-primary text-sm font-semibold mt-2">Menos de R$0,54 por dia</p>
</div>
```

### 7.8 Ticker / marquee

```tsx
// Fundo primary, texto preto — alto contraste
<Ticker text="GARANTA SUA VAGA · VAGAS LIMITADAS" bgColor="bg-primary" textColor="text-black" />
```

### 7.9 Depoimento

```tsx
<article className="flex flex-col min-h-[280px] p-8 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.08] hover:border-primary/35 transition-all">
  <blockquote className="flex-1 border-l-[3px] border-primary pl-5">
    <p className="text-white/90 text-sm leading-relaxed">{quote}</p>
  </blockquote>
</article>
```

### 7.10 Cookie / consent (tom respeitoso + CTA marca)

```tsx
<button className="rounded-lg bg-primary px-4 py-2.5 text-xs font-black uppercase text-black hover:brightness-110">
  Aceitar
</button>
```

---

## 8. Padrões de UX

### 8.1 Hierarquia de atenção (landing)

1. Urgência (faixa vermelha) — se ativa  
2. Headline + preço em ouro  
3. CTA primário  
4. Prova social (stats, depoimentos, prints)  
5. Objeções / FAQ  
6. CTA final + floating mobile  

### 8.2 Floating CTA (mobile)

- Aparece após `scrollY > 600`
- `rounded-full`, `shadow-primary/30`
- Label: “Garantir minha vaga”

### 8.3 Light experience

- Ativada via hook `useLightExperience` — remove motion pesado e simplifica galeria.
- **Sempre** oferecer caminho equivalente sem animação.

### 8.4 Formulários e leads

- Mensagens de erro: claras, sem culpar o usuário.
- Sucesso: reforçar próximo passo (“acesse o e-mail”, “entrada na comunidade”).

### 8.5 CRM (experiência interna)

- Sidebar neutra; badges de status com cores semânticas (`status-badge`).
- Ao comunicar com aluno por e-mail/WhatsApp, **exportar tom da seção 5**, não tom administrativo frio.

---

## 9. Do's & Don'ts

### ✅ Do

- Usar preto profundo + ouro como par principal.
- Uppercase em headlines de venda.
- Mostrar preço ancora (R$497) riscado antes de R$197.
- Repetir provas concretas (calls 2x/semana, 12 meses, networking).
- Manter CTAs com verbo de ação e nome da marca.

### ❌ Don't

- Fundo claro na landing principal (quebra identidade).
- Roxo/azul gradient “startup genérica”.
- Múltiplas cores de CTA competindo com o ouro.
- Ícones coloridos aleatórios (arco-íris).
- Urgência falsa em todo pixel (fadiga e desconfiança).
- Reduzir contraste de texto crítico abaixo de `white/35`.

---

## 10. Assets oficiais

| Asset | URL / caminho |
|-------|----------------|
| Logo PNG | `LOGO_URL` em `apps/crm/src/lib/sales/knowledge.ts` |
| Hero mentor | `HERO_IMAGE` (mesmo arquivo) |
| Ícones marca | `docs/brand/icons/*.png` |
| Checkout | `https://pay.kiwify.com.br/26ERa3r` |

---

## 11. Agente de marca (agentc)

O agente **`ascend-brand`** é compilado a partir de `agents/ascend-brand.md` e expõe capabilities de consulta zero-LLM (`extract` / `hash`).

### Compilar

```bash
# Via MCP no Cursor: agentc_compile com spec_path agents/ascend-brand.md
```

### Consultar (exemplos)

| Capability | Pergunta tipo |
|------------|----------------|
| `get_palette` | Quais cores usar no botão? |
| `get_voice` | Como escrever um e-mail de boas-vindas? |
| `get_component_cta` | Classes do CTA principal? |
| `get_icon_rules` | Posso usar ícone azul? |
| `get_application_rules` | Checklist antes de publicar? |

### Manutenção

1. Edite este `README.md` como documento humano.
2. Espelhe mudanças críticas nas seções `### body` de `agents/ascend-brand.md`.
3. Recompile com `agentc_compile`.

---

*Ascend Club — Manual da Marca · Documento vivo. Dúvidas de aplicação: consulte o agente `ascend-brand`.*
