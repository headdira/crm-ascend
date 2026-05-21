/** Tokens visuais do agente ascend-brand (manual da marca). */

export const brandCta = {
  primary:
    "inline-flex items-center justify-center gap-3 rounded-2xl bg-primary px-10 py-6 text-[#0a0a0a] font-black uppercase tracking-wide text-lg xl:text-xl hover:brightness-110 shadow-[0_0_50px_rgba(255,184,0,0.3)] transition-all",
  nav: "inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[#0a0a0a] font-black uppercase text-sm tracking-wide hover:brightness-110 shadow-[0_0_40px_rgba(255,184,0,0.25)] transition-all",
  floating:
    "inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-6 py-3.5 text-[#0a0a0a] font-black uppercase text-xs tracking-wide whitespace-nowrap shadow-[0_0_30px_rgba(255,184,0,0.3)] hover:brightness-110 transition-all",
} as const;

export const brandTypography = {
  eyebrow: "text-sm tracking-[0.3em] uppercase text-primary font-bold",
  h1: "text-5xl sm:text-6xl lg:text-7xl font-black uppercase leading-[0.95] text-[#fafafa]",
  h2: "text-4xl sm:text-5xl md:text-6xl font-black uppercase text-[#fafafa] leading-tight",
  body: "text-lg text-white/65 leading-relaxed",
  price: "text-7xl font-black text-primary leading-none drop-shadow-[0_0_30px_rgba(255,184,0,0.35)]",
  micro: "text-xs text-white/35",
} as const;

export const brandSurfaces = {
  base: "bg-[#0a0a0a]",
  deep: "bg-[#0d0d0d]",
  elevated: "bg-[#111111]",
} as const;
