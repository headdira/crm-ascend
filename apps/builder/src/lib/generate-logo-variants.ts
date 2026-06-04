import { BUILDER_FONT_OPTIONS } from "@crm-ascend/validation";

export type GeneratedLogoVariant = {
  id: string;
  label: string;
  svg: string;
};

const GENERATED_VARIANT_LABELS: Record<string, string> = {
  stacked: "Marca e nome",
  horizontal: "Faixa",
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

export function truncateStoreName(name: string, max = 28): string {
  const t = name.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

export function storeInitials(name: string): string {
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
      return "var(--font-montserrat), Montserrat, sans-serif";
    case "playfair":
      return 'var(--font-playfair), "Playfair Display", serif';
    default:
      return 'var(--font-dm-sans), "DM Sans", sans-serif';
  }
}

export function titleFontSize(name: string): number {
  const len = name.length;
  if (len <= 10) return 22;
  if (len <= 16) return 18;
  if (len <= 22) return 15;
  return 13;
}

function wrapSvg(inner: string, viewBox: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="none">${inner}</svg>`;
}

function buildVariants(
  displayName: string,
  initials: string,
  fontFamily: string,
  fontSize: number,
): GeneratedLogoVariant[] {
  const safe = escapeXml(displayName);
  const safeInitials = escapeXml(initials);

  const wordmark = wrapSvg(
    `<text x="240" y="58" text-anchor="middle" fill="#PRIMARY" font-family="${fontFamily}" font-size="${fontSize + 6}" font-weight="700">${safe}</text>
    <rect x="120" y="78" width="240" height="8" rx="4" fill="#SECONDARY"/>`,
    "0 0 480 140",
  );

  const stacked = wrapSvg(
    `<rect x="116" y="24" width="88" height="88" rx="20" fill="#SECONDARY"/>
    <text x="160" y="78" text-anchor="middle" fill="#PRIMARY" font-family="${fontFamily}" font-size="32" font-weight="700">${safeInitials}</text>
    <text x="160" y="248" text-anchor="middle" fill="#PRIMARY" font-family="${fontFamily}" font-size="${fontSize}" font-weight="700">${safe}</text>`,
    "0 0 320 320",
  );

  const horizontal = wrapSvg(
    `<rect x="16" y="20" width="488" height="80" rx="24" fill="#SECONDARY"/>
    <text x="260" y="68" text-anchor="middle" fill="#PRIMARY" font-family="${fontFamily}" font-size="${fontSize + 4}" font-weight="700">${safe}</text>`,
    "0 0 520 120",
  );

  const monogram = wrapSvg(
    `<circle cx="160" cy="160" r="134" fill="#SECONDARY"/>
    <circle cx="160" cy="160" r="104" fill="#PRIMARY"/>
    <text x="160" y="172" text-anchor="middle" fill="#SECONDARY" font-family="${fontFamily}" font-size="56" font-weight="700">${safeInitials}</text>`,
    "0 0 320 320",
  );

  const badge = wrapSvg(
    `<rect x="26" y="26" width="268" height="268" rx="134" fill="#SECONDARY"/>
    <rect x="46" y="46" width="228" height="228" rx="114" fill="#PRIMARY"/>
    <text x="160" y="168" text-anchor="middle" fill="#SECONDARY" font-family="${fontFamily}" font-size="${fontSize - 1}" font-weight="700">${safe}</text>`,
    "0 0 320 320",
  );

  return [
    { id: "wordmark", label: GENERATED_VARIANT_LABELS.wordmark!, svg: wordmark },
    { id: "stacked", label: GENERATED_VARIANT_LABELS.stacked!, svg: stacked },
    { id: "horizontal", label: GENERATED_VARIANT_LABELS.horizontal!, svg: horizontal },
    { id: "monogram", label: GENERATED_VARIANT_LABELS.monogram!, svg: monogram },
    { id: "badge", label: GENERATED_VARIANT_LABELS.badge!, svg: badge },
  ];
}

export function generateLogoVariants(params: {
  storeName: string;
  niche: string;
  fontId: string;
}): GeneratedLogoVariant[] {
  void params.niche;
  const trimmed = params.storeName.trim();
  if (trimmed.length < 2) return [];

  const displayName = truncateStoreName(trimmed);
  const fontFamily = fontFamilyFor(params.fontId || "dm-sans");
  const fontSize = titleFontSize(displayName);

  return buildVariants(displayName, storeInitials(trimmed), fontFamily, fontSize);
}

export function findGeneratedLogoSvg(
  variants: GeneratedLogoVariant[],
  variantId: string,
): string | null {
  return variants.find((v) => v.id === variantId)?.svg ?? null;
}

/** UUID de logo do catálogo (referência legada; envio gerado não exige catálogo). */
export function fallbackCatalogLogoId(
  logos: { id: string; niche: string }[],
): string | null {
  return logos.find((l) => l.niche === "Genérico")?.id ?? logos[0]?.id ?? null;
}
