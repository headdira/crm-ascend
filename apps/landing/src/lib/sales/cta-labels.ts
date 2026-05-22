/** Rótulos legíveis no CRM para trackLabel dos CTAs */
export const CTA_LABELS: Record<string, string> = {
  hero_nav: "Header — Entrar Agora",
  hero_main: "Hero — CTA principal",
  pricing_main: "Seção preço — Garantir vaga",
  final_section: "Seção final — CTA",
  floating_mobile: "Botão flutuante (mobile)",
};

export function ctaLabel(trackLabel?: string): string | undefined {
  if (!trackLabel) return undefined;
  return CTA_LABELS[trackLabel] ?? trackLabel;
}
