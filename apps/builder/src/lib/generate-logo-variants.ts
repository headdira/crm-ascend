import { BUILDER_FONT_OPTIONS } from "@crm-ascend/validation";

export type GeneratedLogoVariant = {
  id: string;
  label: string;
  svg: string;
};

const GENERATED_VARIANT_LABELS: Record<string, string> = {
  stacked: "Ícone e nome",
  horizontal: "Lado a lado",
  monogram: "Monograma",
  badge: "Selo",
  wordmark: "Tipográfica",
};

export function generatedLogoVariantLabel(id: string): string {
  return GENERATED_VARIANT_LABELS[id] ?? id;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function truncateStoreName(name: string, max = 22): string {
  const t = name.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

function storeInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
  }
  return name.trim().slice(0, 2).toUpperCase() || "LO";
}

function fontFamilyFor(fontId: string): string {
  const opt = BUILDER_FONT_OPTIONS.find((f) => f.id === fontId);
  switch (opt?.id) {
    case "montserrat":
      return "Montserrat, sans-serif";
    case "playfair":
      return '"Playfair Display", serif';
    default:
      return '"DM Sans", sans-serif';
  }
}

function titleFontSize(name: string): number {
  const len = name.length;
  if (len <= 10) return 13;
  if (len <= 16) return 11;
  if (len <= 22) return 9;
  return 8;
}

/** Ícone do nicho (viewBox 0 0 24 24), cores #PRIMARY / #SECONDARY. */
function nicheIconMarkup(niche: string): string {
  switch (niche) {
    case "Pet":
      return `<ellipse cx="12" cy="14" rx="7" ry="5.5" fill="#PRIMARY"/><circle cx="7.5" cy="8" r="3" fill="#SECONDARY"/><circle cx="16.5" cy="8" r="3" fill="#SECONDARY"/><circle cx="9.5" cy="5" r="2.2" fill="#SECONDARY"/><circle cx="14.5" cy="5" r="2.2" fill="#SECONDARY"/>`;
    case "Casa e praticidade":
      return `<path d="M4 11 12 4l8 7v9H4v-9z" fill="#SECONDARY"/><rect x="9" y="14" width="6" height="6" rx="1" fill="#PRIMARY"/>`;
    case "Moda masculina":
      return `<path d="M12 3 4 8v13h16V8l-8-5z" fill="#SECONDARY"/><path d="M12 9 7 12v6h10v-6l-5-3z" fill="#PRIMARY"/>`;
    case "Moda feminina":
      return `<circle cx="12" cy="12" r="10" fill="#SECONDARY"/><circle cx="12" cy="12" r="7" fill="#PRIMARY"/><path d="M8 16c2-3 6-3 8 0" stroke="#SECONDARY" stroke-width="1.8" stroke-linecap="round" fill="none"/>`;
    case "Tecnologia":
      return `<rect x="3" y="5" width="18" height="12" rx="2" fill="#SECONDARY"/><rect x="5" y="7" width="14" height="8" rx="1" fill="#PRIMARY"/><path d="M10 19h4" stroke="#PRIMARY" stroke-width="2" stroke-linecap="round"/>`;
    case "Saúde e bem-estar":
      return `<circle cx="12" cy="12" r="10" fill="#SECONDARY"/><path d="M12 7v10M7 12h10" stroke="#PRIMARY" stroke-width="2.5" stroke-linecap="round"/>`;
    case "Infantil":
      return `<path d="M12 3l2.2 6.8H21l-5.5 4 2.1 6.7L12 16.5 6.4 20.5l2.1-6.7L3 9.8h6.8L12 3z" fill="#SECONDARY"/><circle cx="12" cy="12" r="4" fill="#PRIMARY"/>`;
    case "Beleza e cosméticos":
      return `<circle cx="8" cy="10" r="3" fill="#SECONDARY"/><circle cx="16" cy="14" r="4" fill="#PRIMARY"/><path d="M6 18c3-4 9-4 12 0" stroke="#SECONDARY" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    case "Ferramentas e utilidades":
      return `<path d="M14 3l7 7-9 9-7-7 9-9z" fill="#SECONDARY"/><circle cx="7" cy="17" r="4" fill="#PRIMARY"/>`;
    default:
      return `<rect x="4" y="4" width="16" height="16" rx="4" fill="#SECONDARY"/><rect x="8" y="8" width="8" height="8" rx="2" fill="#PRIMARY"/><path d="M12 8v8M8 12h8" stroke="#SECONDARY" stroke-width="1.5" stroke-linecap="round"/>`;
  }
}

function wrapSvg(inner: string, viewBox: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="none">${inner}</svg>`;
}

function buildVariants(
  displayName: string,
  initials: string,
  fontFamily: string,
  niche: string,
  fontSize: number,
): GeneratedLogoVariant[] {
  const safe = escapeXml(displayName);
  const icon = nicheIconMarkup(niche);

  const stacked = wrapSvg(
    `<rect width="120" height="120" rx="16" fill="#SECONDARY"/>
    <g transform="translate(36,14)">${icon}</g>
    <text x="60" y="98" text-anchor="middle" fill="#PRIMARY" font-family="${fontFamily}" font-size="${fontSize}" font-weight="700">${safe}</text>`,
    "0 0 120 120",
  );

  const horizontal = wrapSvg(
    `<rect width="200" height="72" rx="12" fill="#SECONDARY"/>
    <g transform="translate(10,14)">${icon}</g>
    <text x="58" y="44" fill="#PRIMARY" font-family="${fontFamily}" font-size="${fontSize + 1}" font-weight="700">${safe}</text>`,
    "0 0 200 72",
  );

  const monogram = wrapSvg(
    `<circle cx="60" cy="60" r="56" fill="#SECONDARY"/>
    <circle cx="60" cy="60" r="44" fill="#PRIMARY"/>
    <text x="60" y="68" text-anchor="middle" fill="#SECONDARY" font-family="${fontFamily}" font-size="28" font-weight="700">${escapeXml(initials)}</text>`,
    "0 0 120 120",
  );

  const badge = wrapSvg(
    `<rect width="120" height="120" rx="60" fill="#SECONDARY"/>
    <rect x="10" y="10" width="100" height="100" rx="50" fill="#PRIMARY"/>
    <text x="60" y="58" text-anchor="middle" fill="#SECONDARY" font-family="${fontFamily}" font-size="${fontSize - 1}" font-weight="700">${safe}</text>
    <g transform="translate(48,62) scale(0.65)">${icon}</g>`,
    "0 0 120 120",
  );

  const wordmark = wrapSvg(
    `<rect width="200" height="64" rx="10" fill="#SECONDARY"/>
    <text x="16" y="38" fill="#PRIMARY" font-family="${fontFamily}" font-size="${fontSize + 2}" font-weight="700">${safe}</text>
    <rect x="16" y="46" width="120" height="4" rx="2" fill="#PRIMARY"/>
    <g transform="translate(168,12) scale(0.9)">${icon}</g>`,
    "0 0 200 64",
  );

  return [
    { id: "stacked", label: GENERATED_VARIANT_LABELS.stacked!, svg: stacked },
    { id: "horizontal", label: GENERATED_VARIANT_LABELS.horizontal!, svg: horizontal },
    { id: "monogram", label: GENERATED_VARIANT_LABELS.monogram!, svg: monogram },
    { id: "badge", label: GENERATED_VARIANT_LABELS.badge!, svg: badge },
    { id: "wordmark", label: GENERATED_VARIANT_LABELS.wordmark!, svg: wordmark },
  ];
}

export function generateLogoVariants(params: {
  storeName: string;
  niche: string;
  fontId: string;
}): GeneratedLogoVariant[] {
  const trimmed = params.storeName.trim();
  if (trimmed.length < 2) return [];

  const displayName = truncateStoreName(trimmed);
  const fontFamily = fontFamilyFor(params.fontId || "dm-sans");
  const fontSize = titleFontSize(displayName);

  return buildVariants(
    displayName,
    storeInitials(trimmed),
    fontFamily,
    params.niche || "Genérico",
    fontSize,
  );
}

export function findGeneratedLogoSvg(
  variants: GeneratedLogoVariant[],
  variantId: string,
): string | null {
  return variants.find((v) => v.id === variantId)?.svg ?? null;
}

/** UUID de logo do catálogo usado como referência quando a logo é gerada no wizard. */
export function fallbackCatalogLogoId(
  logos: { id: string; niche: string }[],
): string | null {
  return logos.find((l) => l.niche === "Genérico")?.id ?? logos[0]?.id ?? null;
}
