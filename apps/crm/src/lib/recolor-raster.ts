import {
  parseBuilderAssetContent,
  rasterDataUrlToSvg,
  recolorSvg,
} from "@crm-ascend/validation";
import { getRasterRecolorTemplate, recolorRasterTemplate } from "./raster-template";

export async function recolorRasterToDataUrl(
  src: string,
  primary: string,
  secondary: string,
): Promise<{ dataUrl: string; width: number; height: number }> {
  const template = await getRasterRecolorTemplate(src);
  return recolorRasterTemplate(template, primary, secondary, 0.92);
}

export async function recolorRasterPreviewToDataUrl(
  src: string,
  primary: string,
  secondary: string,
  maxWidth: number,
): Promise<{ dataUrl: string; width: number; height: number }> {
  const template = await getRasterRecolorTemplate(src, maxWidth);
  return recolorRasterTemplate(template, primary, secondary, 0.85);
}

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
