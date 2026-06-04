import { BUILDER_FONT_OPTIONS, rasterDataUrlToSvg } from "@crm-ascend/validation";
import {
  storeInitials,
  titleFontSize,
  truncateStoreName,
} from "./generate-logo-variants";

const EXPORT_SCALE = 2;

type DrawParams = {
  displayName: string;
  initials: string;
  fontFamily: string;
  primary: string;
  secondary: string;
};

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function fitTextSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  family: string,
  maxWidth: number,
  startSize: number,
  minSize: number,
): number {
  let size = startSize;
  while (size > minSize) {
    ctx.font = `700 ${size}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) return size;
    size -= 1;
  }
  ctx.font = `700 ${minSize}px ${family}`;
  return minSize;
}

function setFont(ctx: CanvasRenderingContext2D, family: string, size: number, weight = "700") {
  ctx.font = `${weight} ${size}px ${family}`;
}

function drawWordmark(ctx: CanvasRenderingContext2D, w: number, h: number, p: DrawParams) {
  const pad = w * 0.08;
  const maxTextW = w - pad * 2;
  const startWord = titleFontSize(p.displayName) * 3.2;
  const size = fitTextSize(ctx, p.displayName, p.fontFamily, maxTextW, startWord, 18);
  setFont(ctx, p.fontFamily, size);
  ctx.fillStyle = p.primary;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(p.displayName, w / 2, h * 0.46);
  const textW = Math.min(ctx.measureText(p.displayName).width, maxTextW);
  roundRect(ctx, w / 2 - textW / 2, h * 0.62, textW, h * 0.06, h * 0.03);
  ctx.fillStyle = p.secondary;
  ctx.fill();
}

function drawStacked(ctx: CanvasRenderingContext2D, w: number, h: number, p: DrawParams) {
  const box = w * 0.28;
  roundRect(ctx, w / 2 - box / 2, h * 0.12, box, box, box * 0.22);
  ctx.fillStyle = p.secondary;
  ctx.fill();
  setFont(ctx, p.fontFamily, box * 0.38);
  ctx.fillStyle = p.primary;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(p.initials, w / 2, h * 0.12 + box / 2 + 2);
  const maxTextW = w * 0.88;
  const startStacked = titleFontSize(p.displayName) * 2.6;
  const size = fitTextSize(ctx, p.displayName, p.fontFamily, maxTextW, startStacked, 16);
  setFont(ctx, p.fontFamily, size);
  ctx.fillStyle = p.primary;
  ctx.fillText(p.displayName, w / 2, h * 0.78);
}

function drawHorizontal(ctx: CanvasRenderingContext2D, w: number, h: number, p: DrawParams) {
  roundRect(ctx, w * 0.06, h * 0.18, w * 0.88, h * 0.64, h * 0.2);
  ctx.fillStyle = p.secondary;
  ctx.fill();
  const maxTextW = w * 0.78;
  const startHoriz = titleFontSize(p.displayName) * 2.8;
  const size = fitTextSize(ctx, p.displayName, p.fontFamily, maxTextW, startHoriz, 16);
  setFont(ctx, p.fontFamily, size);
  ctx.fillStyle = p.primary;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(p.displayName, w / 2, h / 2 + 2);
}

function drawMonogram(ctx: CanvasRenderingContext2D, w: number, h: number, p: DrawParams) {
  const r = Math.min(w, h) * 0.42;
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
  ctx.fillStyle = p.secondary;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, r * 0.78, 0, Math.PI * 2);
  ctx.fillStyle = p.primary;
  ctx.fill();
  setFont(ctx, p.fontFamily, r * 0.72);
  ctx.fillStyle = p.secondary;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(p.initials, w / 2, h / 2 + 3);
}

function drawBadge(ctx: CanvasRenderingContext2D, w: number, h: number, p: DrawParams) {
  roundRect(ctx, w * 0.08, h * 0.08, w * 0.84, h * 0.84, w * 0.42);
  ctx.fillStyle = p.secondary;
  ctx.fill();
  roundRect(ctx, w * 0.14, h * 0.14, w * 0.72, h * 0.72, w * 0.36);
  ctx.fillStyle = p.primary;
  ctx.fill();
  const maxTextW = w * 0.62;
  const startBadge = titleFontSize(p.displayName) * 2.4;
  const size = fitTextSize(ctx, p.displayName, p.fontFamily, maxTextW, startBadge, 14);
  setFont(ctx, p.fontFamily, size);
  ctx.fillStyle = p.secondary;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(p.displayName, w / 2, h / 2 + 2);
}

const VARIANT_FRAMES: Record<
  string,
  { width: number; height: number; draw: typeof drawWordmark }
> = {
  wordmark: { width: 480, height: 140, draw: drawWordmark },
  stacked: { width: 320, height: 320, draw: drawStacked },
  horizontal: { width: 520, height: 120, draw: drawHorizontal },
  monogram: { width: 320, height: 320, draw: drawMonogram },
  badge: { width: 320, height: 320, draw: drawBadge },
};

export function builderFontFamily(fontId: string): string {
  if (typeof document !== "undefined") {
    const cssVar =
      BUILDER_FONT_OPTIONS.find((f) => f.id === fontId)?.cssVar ?? "--font-dm-sans";
    const fromVar = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
    if (fromVar) return fromVar;
  }
  switch (fontId) {
    case "montserrat":
      return "Montserrat, sans-serif";
    case "playfair":
      return '"Playfair Display", serif';
    default:
      return '"DM Sans", sans-serif';
  }
}

async function ensureBuilderFontsLoaded(fontId: string): Promise<void> {
  const family = builderFontFamily(fontId);
  const probe = `700 32px ${family}`;
  try {
    await document.fonts.load(probe);
  } catch {
    /* ignore — canvas usa fallback do sistema */
  }
  await document.fonts.ready;
}

/** Logo gerada no wizard → PNG embutido em SVG (mesmo pipeline dos banners raster). */
export async function exportGeneratedLogoRaster(params: {
  variantId: string;
  storeName: string;
  fontId: string;
  primary: string;
  secondary: string;
}): Promise<string> {
  const frame = VARIANT_FRAMES[params.variantId] ?? VARIANT_FRAMES.wordmark!;
  const trimmed = params.storeName.trim();
  if (trimmed.length < 2) {
    throw new Error("Nome da loja muito curto para gerar logo.");
  }

  await ensureBuilderFontsLoaded(params.fontId || "dm-sans");

  const drawParams: DrawParams = {
    displayName: truncateStoreName(trimmed),
    initials: storeInitials(trimmed),
    fontFamily: builderFontFamily(params.fontId || "dm-sans"),
    primary: params.primary,
    secondary: params.secondary,
  };

  const canvas = document.createElement("canvas");
  canvas.width = frame.width * EXPORT_SCALE;
  canvas.height = frame.height * EXPORT_SCALE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Não foi possível renderizar a logo (canvas).");

  ctx.scale(EXPORT_SCALE, EXPORT_SCALE);
  frame.draw(ctx, frame.width, frame.height, drawParams);

  const dataUrl = canvas.toDataURL("image/png");
  return rasterDataUrlToSvg(dataUrl, canvas.width, canvas.height);
}
