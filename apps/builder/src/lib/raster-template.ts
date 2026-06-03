import { hexToRgb } from "@crm-ascend/validation";
import { rasterAssetUrlCandidates } from "./raster-url";

export type RasterRecolorTemplate = {
  width: number;
  height: number;
  /** Alpha por pixel (length = width × height). */
  alpha: Uint8Array;
  /** Peso de mistura (1 − luminância) × 255; 0 se transparente. */
  tint: Uint8Array;
};

const templateCache = new Map<string, Promise<RasterRecolorTemplate>>();

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (typeof window !== "undefined") {
      try {
        if (new URL(url).origin !== window.location.origin) {
          img.crossOrigin = "anonymous";
        }
      } catch {
        /* ignore */
      }
    }
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Não foi possível carregar a imagem: ${url}`));
    img.src = url;
  });
}

async function loadRasterImage(src: string): Promise<HTMLImageElement> {
  const candidates = rasterAssetUrlCandidates(src);
  let lastError: Error | null = null;
  for (const url of candidates) {
    try {
      return await loadImage(url);
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
    }
  }
  throw lastError ?? new Error(`Não foi possível carregar a imagem: ${src}`);
}

function buildTemplateFromImageData(imageData: ImageData): RasterRecolorTemplate {
  const { width, height, data } = imageData;
  const n = width * height;
  const alpha = new Uint8Array(n);
  const tint = new Uint8Array(n);

  for (let j = 0, i = 0; j < n; j++, i += 4) {
    const a = data[i + 3]!;
    alpha[j] = a;
    if (a < 8) continue;
    const r = data[i]!;
    const g = data[i + 1]!;
    const b = data[i + 2]!;
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    tint[j] = Math.round((1 - luminance) * 255);
  }

  return { width, height, alpha, tint };
}

function cacheKey(src: string, maxWidth?: number): string {
  return maxWidth ? `${src}@w${maxWidth}` : `${src}@full`;
}

/** Carrega o template uma vez (com cache). `maxWidth` reduz custo no preview. */
export function getRasterRecolorTemplate(
  src: string,
  maxWidth?: number,
): Promise<RasterRecolorTemplate> {
  const key = cacheKey(src, maxWidth);
  let pending = templateCache.get(key);
  if (!pending) {
    pending = (async () => {
      const img = await loadRasterImage(src);
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (maxWidth && w > maxWidth) {
        h = Math.round((h * maxWidth) / w);
        w = maxWidth;
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas não disponível");
      ctx.drawImage(img, 0, 0, w, h);
      return buildTemplateFromImageData(ctx.getImageData(0, 0, w, h));
    })();
    templateCache.set(key, pending);
  }
  return pending;
}

/** Aplica paleta no template em memória (síncrono, sem recarregar imagem). */
export function recolorRasterTemplate(
  template: RasterRecolorTemplate,
  primary: string,
  secondary: string,
  jpegQuality = 0.88,
): { dataUrl: string; width: number; height: number } {
  const { width, height, alpha, tint } = template;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas não disponível");

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  const [pr, pg, pb] = hexToRgb(primary);
  const [sr, sg, sb] = hexToRgb(secondary);
  const n = alpha.length;

  for (let j = 0, i = 0; j < n; j++, i += 4) {
    const a = alpha[j]!;
    data[i + 3] = a;
    if (a < 8) continue;
    const t = tint[j]! / 255;
    data[i] = Math.round(sr + (pr - sr) * t);
    data[i + 1] = Math.round(sg + (pg - sg) * t);
    data[i + 2] = Math.round(sb + (pb - sb) * t);
  }

  ctx.putImageData(imageData, 0, 0);
  return {
    dataUrl: canvas.toDataURL("image/jpeg", jpegQuality),
    width,
    height,
  };
}

export const BUILDER_RASTER_PREVIEW_MAX_WIDTH = 960;
