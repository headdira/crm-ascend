---
agent: ascend-brand
version: 1.0.0
description: Agente guardião da marca Ascend Club — paleta, voz, ícones, componentes e regras de aplicação.
---

# Ascend Brand Agent

> Consulte antes de criar UI, copy ou materiais. Fonte humana: `docs/brand/README.md`.

## capability: get_palette
**signature:** `() -> string`
**primitive:** extract
**section:** palette

### palette
Paleta Ascend Club (landing):
- Ascend Gold #FFB800 — CTAs, preço, ícones ativos, glow. Texto sobre ouro: #0A0A0A.
- Ascend Black #0A0A0A — fundo principal.
- Ascend Snow #FAFAFA — texto principal.
- Surface #111 / #0D0D0D — cards e seções.
- Urgency Red #DC2626 — só faixas de escassez reais (vagas limitadas).
- Texto secundário: white/65 corpo, white/35 legendas. Bordas: white/5–8, primary/10–30.
- Glow: shadow-[0_0_50px_rgba(255,184,0,0.3)], radial-gradient rgba(255,184,0,0.12).
- CRM interno: shadcn neutro; ouro reservado para marketing e celebração.

## capability: get_typography
**signature:** `() -> string`
**primitive:** extract
**section:** typography

### typography
Tipografia:
- Marketing: Inter (font-inter), Black 900 em headlines conversão UPPERCASE.
- Eyebrow: text-sm tracking-[0.3em] uppercase text-primary font-bold.
- H1: text-5xl→7xl font-black uppercase leading-[0.95].
- Corpo: text-lg text-white/65. Preço: text-7xl font-black text-primary.
- CTA: font-black uppercase tracking-wide text-lg.
- CRM: Geist + Inter, pesos moderados. Máximo 2 famílias por ecrã.

## capability: get_voice
**signature:** `() -> string`
**primitive:** extract
**section:** voice

### voice
Tom Ascend: direto, confiante, próximo, urgente com ética, premium acessível.
Usar: renda online, passo a passo, networking, calls ao vivo, mentoria, do zero, suporte próximo, método validado, garantir vaga.
Evitar: jargão corporativo, promessas absolutas falsas, tom infantil.
CTA exemplo: "Quero Entrar No Ascend Club". Urgência só se verdadeira.
FAQ: mentoria com acompanhamento ≠ curso gravado sozinho.

## capability: get_icon_rules
**signature:** `() -> string`
**primitive:** extract
**section:** icons

### icons
Ícones:
- PNG marca em docs/brand/icons/: ascend-arrow, networking, growth, live-calls, trust, gamification (ouro #FFB800 em preto).
- Código: lucide-react — CheckCircle, ArrowRight, Star (fill-primary), Flame, Clock, Shield, Zap.
- Ativo: text-primary #FFB800. Inativo: text-white/35.
- Tamanhos: 16px UI, 24px marketing, 48px+ features. Não misturar bibliotecas no mesmo bloco.

## capability: get_component_cta
**signature:** `() -> string`
**primitive:** extract
**section:** component_cta

### component_cta
CTA primário Ascend:
className="inline-flex items-center gap-3 rounded-2xl bg-primary px-10 py-6 text-black font-black uppercase tracking-wide text-lg hover:brightness-110 shadow-[0_0_50px_rgba(255,184,0,0.3)]"
Nav pill: rounded-full px-6 py-3 mesmas cores. Floating mobile: rounded-full shadow-primary/30, label "Garantir minha vaga".

## capability: get_component_card
**signature:** `() -> string`
**primitive:** extract
**section:** component_card

### component_card
Card benefício: rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-primary/30, ícone CheckCircle text-primary.
Card stat: rounded-2xl border-white/5, valor text-primary text-3xl font-black, label text-white/35 uppercase tracking-widest text-[10px].
Card flutuante hero: bg-black/90 border-primary/20 rounded-2xl backdrop-blur-xl.

## capability: get_application_rules
**signature:** `() -> string`
**primitive:** extract
**section:** application_rules

### application_rules
Requisitos de aplicação:
- Grid: max-w-7xl hero, max-w-6xl benefícios, max-w-4xl pricing, px-6, py-24 seções.
- Radius: CTA rounded-2xl/xl, badges rounded-full, imagens rounded-[28px].
- Motion: framer-motion suave; desligar em data-light/prefers-reduced-motion.
- Checklist publicação: fundo #0A0A0A, CTA ouro+texto preto, headline uppercase, glow em preço/CTA, logo sem distorção, preço R$197/R$497, vermelho só escassez real.
- Hierarquia UX: urgência → headline/preço → CTA → prova → FAQ → CTA final.

## capability: get_dos_donts
**signature:** `() -> string`
**primitive:** extract
**section:** dos_donts

### dos_donts
DO: preto+ouro, uppercase em venda, ancora de preço, provas concretas, CTAs com marca.
DON'T: fundo claro na landing, gradientes roxo/azul genéricos, vários CTAs coloridos, ícones arco-íris, urgência falsa em tudo, texto crítico abaixo white/35.

## capability: brand_tagline
**signature:** `() -> string`
**primitive:** hash
**answer:** "Ascend Club — mentoria em grupo para construir renda online do zero, com método validado, networking e calls ao vivo."

## capability: primary_hex
**signature:** `() -> string`
**primitive:** hash
**answer:** "#FFB800"

## capability: background_hex
**signature:** `() -> string`
**primitive:** hash
**answer:** "#0A0A0A"
