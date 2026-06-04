import { BUILDER_FONT_OPTIONS } from "@crm-ascend/validation";

export type GeneratedLogoVariant = {
  id: string;
  label: string;
  svg: string;
};

const GENERATED_VARIANT_LABELS: Record<string, string> = {
  wordmark: "Nome limpo",
  horizontal: "Cápsula",
  stacked: "Marca + nome",
  monogram: "Monograma",
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

export function truncateStoreName(name: string, max = 26): string {
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
  if (len <= 8) return 26;
  if (len <= 14) return 22;
  if (len <= 20) return 18;
  return 15;
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
  const fs = fontSize;

  const wordmark = wrapSvg(
    `<text x="280" y="72" text-anchor="middle" fill="#PRIMARY" font-family="${fontFamily}" font-size="${fs + 8}" font-weight="700" letter-spacing="0.04em">${safe}</text>
    <rect x="180" y="88" width="200" height="5" rx="2.5" fill="#SECONDARY"/>`,
    "0 0 560 120",
  );

  const horizontal = wrapSvg(
    `<rect x="24" y="28" width="512" height="64" rx="32" fill="#SECONDARY" opacity="0.18"/>
    <rect x="24" y="28" width="512" height="64" rx="32" stroke="#SECONDARY" stroke-width="2" fill="none"/>
    <text x="280" y="72" text-anchor="middle" fill="#PRIMARY" font-family="${fontFamily}" font-size="${fs + 4}" font-weight="700" letter-spacing="0.03em">${safe}</text>`,
    "0 0 560 120",
  );

  const stacked = wrapSvg(
    `<rect x="232" y="20" width="96" height="96" rx="22" fill="#SECONDARY"/>
    <text x="280" y="78" text-anchor="middle" fill="#PRIMARY" font-family="${fontFamily}" font-size="36" font-weight="700">${safeInitials}</text>
    <text x="280" y="168" text-anchor="middle" fill="#PRIMARY" font-family="${fontFamily}" font-size="${fs}" font-weight="700" letter-spacing="0.03em">${safe}</text>`,
    "0 0 560 200",
  );

  const monogram = wrapSvg(
    `<circle cx="140" cy="140" r="118" stroke="#SECONDARY" stroke-width="6" fill="none"/>
    <circle cx="140" cy="140" r="96" fill="#SECONDARY" opacity="0.15"/>
    <text x="140" y="156" text-anchor="middle" fill="#PRIMARY" font-family="${fontFamily}" font-size="64" font-weight="700">${safeInitials}</text>`,
    "0 0 280 280",
  );

  return [
    { id: "wordmark", label: GENERATED_VARIANT_LABELS.wordmark!, svg: wordmark },
    { id: "horizontal", label: GENERATED_VARIANT_LABELS.horizontal!, svg: horizontal },
    { id: "stacked", label: GENERATED_VARIANT_LABELS.stacked!, svg: stacked },
    { id: "monogram", label: GENERATED_VARIANT_LABELS.monogram!, svg: monogram },
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

export function fallbackCatalogLogoId(
  logos: { id: string; niche: string }[],
): string | null {
  return logos.find((l) => l.niche === "Genérico")?.id ?? logos[0]?.id ?? null;
}
