import { z } from "zod";

export const BUILDER_NICHES = [
  "Casa e praticidade",
  "Pet",
  "Moda masculina",
  "Moda feminina",
  "Saúde e bem-estar",
  "Tecnologia",
  "Infantil",
  "Genérico",
  "Beleza e cosméticos",
  "Ferramentas e utilidades",
] as const;

export const BUILDER_FONT_OPTIONS = [
  { id: "dm-sans", title: "Moderno limpo", cssVar: "--font-dm-sans" },
  { id: "montserrat", title: "Marca forte", cssVar: "--font-montserrat" },
  { id: "playfair", title: "Elegância", cssVar: "--font-playfair" },
] as const;

export const BUILDER_RASTER_PREFIX = "raster:";

export type BuilderAssetContent =
  | { type: "svg"; value: string }
  | { type: "raster"; src: string };

/** Conteúdo do asset: SVG bruto ou `raster:/caminho` para template JPEG/PNG em escala de cinza. */
export function parseBuilderAssetContent(content: string): BuilderAssetContent {
  if (content.startsWith(BUILDER_RASTER_PREFIX)) {
    return { type: "raster", src: content.slice(BUILDER_RASTER_PREFIX.length) };
  }
  return { type: "svg", value: content };
}

export function isRasterAssetContent(content: string): boolean {
  return content.startsWith(BUILDER_RASTER_PREFIX);
}

export function recolorSvg(svg: string, primary: string, secondary: string): string {
  return svg
    .replace(/#PRIMARY/gi, primary)
    .replace(/#SECONDARY/gi, secondary);
}

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

/** Envolve PNG/JPEG recolorido em SVG para o pipeline de tema (preview / Nuvemshop). */
export function rasterDataUrlToSvg(dataUrl: string, width: number, height: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${width} ${height}"><image width="100%" height="100%" href="${dataUrl}" preserveAspectRatio="xMidYMid slice"/></svg>`;
}

export function youtubeEmbedUrl(url: string | null | undefined): string | null {
  if (!url?.trim()) return null;
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      const parts = parsed.pathname.split("/");
      const embedIdx = parts.indexOf("embed");
      if (embedIdx >= 0 && parts[embedIdx + 1]) {
        return `https://www.youtube.com/embed/${parts[embedIdx + 1]}`;
      }
    }
  } catch {
    return null;
  }
  return null;
}

export const builderAssetUpsertSchema = z.object({
  id: z.string().uuid().optional(),
  asset_type: z.enum(["logo", "banner"]),
  name: z.string().min(2).max(120),
  niche: z.enum(BUILDER_NICHES),
  svg_content: z
    .string()
    .min(8)
    .max(50000)
    .refine(
      (s) =>
        s.startsWith(BUILDER_RASTER_PREFIX) ||
        s.trimStart().startsWith("<svg") ||
        s.includes("#PRIMARY"),
      "Use SVG com #PRIMARY/#SECONDARY ou raster:/caminho-da-imagem",
    ),
  sort_order: z.coerce.number().int().min(0).max(999).optional(),
  is_active: z.boolean().optional(),
});

export const builderSettingsSchema = z.object({
  youtube_url: z.string().url().optional().or(z.literal("")),
  affiliate_url: z.string().url().optional().or(z.literal("")),
});

export const builderSubmitSchema = z.object({
  verifyTab: z.enum(["email", "cpf"]),
  courseEmail: z.string().optional(),
  cpf: z.string().optional(),
  storeEmail: z.string().email(),
  storeName: z.string().min(2),
  niche: z.string().min(1),
  bannerIds: z.array(z.string().uuid()).length(3),
  logoId: z.string().uuid(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  fontId: z.string().min(1),
  planWatchedInfo: z.boolean(),
  planWillSubscribe: z.boolean(),
  oauthSessionId: z.string().uuid(),
  /** E-mail e senha usados para entrar no admin Nuvemshop (customização manual). */
  nuvemshopLoginEmail: z.string().email(),
  nuvemshopLoginPassword: z.string().min(4).max(200),
  /** Raster recolorido vira SVG com JPEG embutido — pode passar de 100 KB. */
  logoSvg: z.string().min(10).max(2_000_000),
  bannerSvgs: z.array(z.string().min(10).max(2_000_000)).length(3),
});

const BUILDER_SUBMIT_FIELD_LABELS: Record<string, string> = {
  verifyTab: "Verificação",
  courseEmail: "E-mail do curso",
  cpf: "CPF",
  storeEmail: "E-mail da loja",
  storeName: "Nome da loja",
  niche: "Nicho",
  bannerIds: "Banners",
  logoId: "Logo",
  primaryColor: "Cor principal",
  secondaryColor: "Cor de apoio",
  fontId: "Fonte",
  planWatchedInfo: "Plano (vídeo)",
  planWillSubscribe: "Plano (assinatura)",
  oauthSessionId: "Sessão Nuvemshop",
  nuvemshopLoginEmail: "E-mail de login Nuvemshop",
  nuvemshopLoginPassword: "Senha de login Nuvemshop",
  logoSvg: "Logo (arquivo)",
  bannerSvgs: "Banners (arquivos)",
};

/** Mensagem legível a partir de safeParse().error.flatten() do submit. */
export function formatBuilderSubmitErrors(flat: {
  formErrors: string[];
  fieldErrors: Record<string, string[] | undefined>;
}): string {
  const parts: string[] = [...flat.formErrors];
  for (const [key, msgs] of Object.entries(flat.fieldErrors)) {
    if (!msgs?.length) continue;
    const label = BUILDER_SUBMIT_FIELD_LABELS[key] ?? key;
    parts.push(`${label}: ${msgs.join(", ")}`);
  }
  return parts.length > 0 ? parts.join(" · ") : "Dados inválidos. Revise o formulário.";
}
