import {
  hexToRgb,
  parseBuilderAssetContent,
  rasterDataUrlToSvg,
  recolorSvg,
} from "@crm-ascend/validation";
import { rasterAssetUrlCandidates } from "./raster-url";

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

/**
 * Template em escala de cinza: áreas escuras → cor principal, áreas claras → cor de apoio.
 */
export async function recolorRasterToDataUrl(
  src: string,
  primary: string,
  secondary: string,
): Promise<{ dataUrl: string; width: number; height: number }> {
  const img = await loadRasterImage(src);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas não disponível");

  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const [pr, pg, pb] = hexToRgb(primary);
  const [sr, sg, sb] = hexToRgb(secondary);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a < 8) continue;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const t = 1 - luminance;
    data[i] = Math.round(sr + (pr - sr) * t);
    data[i + 1] = Math.round(sg + (pg - sg) * t);
    data[i + 2] = Math.round(sb + (pb - sb) * t);
  }

  ctx.putImageData(imageData, 0, 0);
  return {
    dataUrl: canvas.toDataURL("image/jpeg", 0.92),
    width: canvas.width,
    height: canvas.height,
  };
}

/** Gera SVG recolorido (vetor ou raster embutido) para envio ao CRM / tema. */
export async function exportRecoloredAsset(
  content: string,
  primary: string,
  secondary: string,
): Promise<string> {
  const parsed = parseBuilderAssetContent(content);
  if (parsed.type === "svg") {
    return recolorSvg(parsed.value, primary, secondary);
  }
  const { dataUrl, width, height } = await recolorRasterToDataUrl(parsed.src, primary, secondary);
  return rasterDataUrlToSvg(dataUrl, width, height);
}
