import {
  parseBuilderAssetContent,
  rasterDataUrlToSvg,
  recolorSvg,
} from "@crm-ascend/validation";
import {
  getRasterRecolorTemplate,
  recolorRasterTemplate,
} from "./raster-template";

/**
 * Recolorização em resolução cheia (envio ao CRM / tema).
 * Template é cacheado após a primeira carga.
 */
export async function recolorRasterToDataUrl(
  src: string,
  primary: string,
  secondary: string,
): Promise<{ dataUrl: string; width: number; height: number }> {
  const template = await getRasterRecolorTemplate(src);
  return recolorRasterTemplate(template, primary, secondary, 0.92);
}

/** Preview no wizard — template menor e JPEG mais leve. */
export async function recolorRasterPreviewToDataUrl(
  src: string,
  primary: string,
  secondary: string,
  maxWidth: number,
): Promise<{ dataUrl: string; width: number; height: number }> {
  const template = await getRasterRecolorTemplate(src, maxWidth);
  return recolorRasterTemplate(template, primary, secondary, 0.85);
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
