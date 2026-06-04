import { BUILDER_FONT_OPTIONS, rasterDataUrlToSvg } from "@crm-ascend/validation";
import {
  storeInitials,
  titleFontSize,
  truncateStoreName,
} from "./generate-logo-variants";

const EXPORT_SCALE = 3;

type DrawParams = {
  displayName: string;
  initials: string;
  fontFamily: string;
  fontWeight: number;
  primary: string;
  secondary: string;
};

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

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

function applyTextStyle(
  ctx: CanvasRenderingContext2D,
  family: string,
  size: number,
  weight: number,
  letterSpacingPx: number,
) {
  ctx.font = `${weight} ${size}px ${family}`;
  ctx.letterSpacing = `${letterSpacingPx}px`;
}

function fitTextSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  family: string,
  weight: number,
  letterSpacingPx: number,
  maxWidth: number,
  startSize: number,
  minSize: number,
): number {
  let size = startSize;
  while (size > minSize) {
    applyTextStyle(ctx, family, size, weight, letterSpacingPx);
    if (ctx.measureText(text).width <= maxWidth) return size;
    size -= 1;
  }
  applyTextStyle(ctx, family, minSize, weight, letterSpacingPx);
  return minSize;
}

function drawWordmark(ctx: CanvasRenderingContext2D, w: number, h: number, p: DrawParams) {
  const maxTextW = w * 0.86;
  const tracking = Math.max(1, w * 0.004);
  const start = titleFontSize(p.displayName) * 3.6;
  const size = fitTextSize(
    ctx,
    p.displayName,
    p.fontFamily,
    p.fontWeight,
    tracking,
    maxTextW,
    start,
    20,
  );
  applyTextStyle(ctx, p.fontFamily, size, p.fontWeight, tracking);
  ctx.fillStyle = p.primary;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(p.displayName, w / 2, h * 0.52);
  const textW = Math.min(ctx.measureText(p.displayName).width, maxTextW);
  const lineW = textW * 0.55;
  roundRect(ctx, w / 2 - lineW / 2, h * 0.72, lineW, h * 0.045, h * 0.022);
  ctx.fillStyle = p.secondary;
  ctx.fill();
}

function drawHorizontal(ctx: CanvasRenderingContext2D, w: number, h: number, p: DrawParams) {
  const padX = w * 0.04;
  const boxH = h * 0.58;
  const boxY = (h - boxH) / 2;
  roundRect(ctx, padX, boxY, w - padX * 2, boxH, boxH / 2);
  ctx.fillStyle = hexToRgba(p.secondary, 0.16);
  ctx.fill();
  ctx.strokeStyle = hexToRgba(p.secondary, 0.85);
  ctx.lineWidth = Math.max(2, w * 0.004);
  ctx.stroke();

  const maxTextW = (w - padX * 2) * 0.88;
  const tracking = Math.max(0.5, w * 0.003);
  const start = titleFontSize(p.displayName) * 3.2;
  const size = fitTextSize(
    ctx,
    p.displayName,
    p.fontFamily,
    p.fontWeight,
    tracking,
    maxTextW,
    start,
    18,
  );
  applyTextStyle(ctx, p.fontFamily, size, p.fontWeight, tracking);
  ctx.fillStyle = p.primary;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(p.displayName, w / 2, h / 2 + 1);
}

function drawStacked(ctx: CanvasRenderingContext2D, w: number, h: number, p: DrawParams) {
  const box = w * 0.22;
  const boxY = h * 0.08;
  roundRect(ctx, w / 2 - box / 2, boxY, box, box, box * 0.24);
  ctx.fillStyle = p.secondary;
  ctx.fill();
  applyTextStyle(ctx, p.fontFamily, box * 0.42, p.fontWeight, 0);
  ctx.fillStyle = p.primary;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(p.initials, w / 2, boxY + box / 2 + 2);

  const maxTextW = w * 0.9;
  const tracking = Math.max(0.5, w * 0.003);
  const start = titleFontSize(p.displayName) * 2.8;
  const size = fitTextSize(
    ctx,
    p.displayName,
    p.fontFamily,
    p.fontWeight,
    tracking,
    maxTextW,
    start,
    16,
  );
  applyTextStyle(ctx, p.fontFamily, size, p.fontWeight, tracking);
  ctx.fillStyle = p.primary;
  ctx.fillText(p.displayName, w / 2, h * 0.78);
}

function drawMonogram(ctx: CanvasRenderingContext2D, w: number, h: number, p: DrawParams) {
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * 0.44;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = p.secondary;
  ctx.lineWidth = Math.max(4, w * 0.018);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.82, 0, Math.PI * 2);
  ctx.fillStyle = hexToRgba(p.secondary, 0.14);
  ctx.fill();
  applyTextStyle(ctx, p.fontFamily, r * 0.58, p.fontWeight, 0);
  ctx.fillStyle = p.primary;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(p.initials, cx, cy + 3);
}

const VARIANT_FRAMES: Record<
  string,
  { width: number; height: number; draw: typeof drawWordmark }
> = {
  wordmark: { width: 560, height: 120, draw: drawWordmark },
  horizontal: { width: 560, height: 120, draw: drawHorizontal },
  stacked: { width: 560, height: 200, draw: drawStacked },
  monogram: { width: 280, height: 280, draw: drawMonogram },
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

function fontWeightFor(fontId: string): number {
  return fontId === "playfair" ? 600 : 700;
}

async function ensureBuilderFontsLoaded(fontId: string): Promise<void> {
  const family = builderFontFamily(fontId);
  const weight = fontWeightFor(fontId);
  const probes = [
    `${weight} 24px ${family}`,
    `${weight} 48px ${family}`,
    `${weight} 72px ${family}`,
  ];
  for (const probe of probes) {
    try {
      await document.fonts.load(probe);
    } catch {
      /* ignore */
    }
  }
  await document.fonts.ready;
}

export async function exportGeneratedLogoRaster(params: {
  variantId: string;
  storeName: string;
  fontId: string;
  primary: string;
  secondary: string;
}): Promise<string> {
  const variantId =
    params.variantId in VARIANT_FRAMES ? params.variantId : "wordmark";
  const frame = VARIANT_FRAMES[variantId]!;
  const trimmed = params.storeName.trim();
  if (trimmed.length < 2) {
    throw new Error("Nome da loja muito curto para gerar logo.");
  }

  const fontId = params.fontId || "dm-sans";
  await ensureBuilderFontsLoaded(fontId);

  const drawParams: DrawParams = {
    displayName: truncateStoreName(trimmed),
    initials: storeInitials(trimmed),
    fontFamily: builderFontFamily(fontId),
    fontWeight: fontWeightFor(fontId),
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
