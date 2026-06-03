"use client";

import { memo, useDeferredValue, useEffect, useState } from "react";
import { parseBuilderAssetContent, recolorSvg } from "@crm-ascend/validation";
import { recolorRasterPreviewToDataUrl } from "@/lib/recolor-raster";
import { getRasterRecolorTemplate, recolorRasterTemplate } from "@/lib/raster-template";

export const ColoredAsset = memo(function ColoredAsset({
  content,
  primary,
  secondary,
  className,
  alt = "",
  previewMaxWidth,
}: {
  content: string;
  primary: string;
  secondary: string;
  className?: string;
  alt?: string;
  /** Largura máxima para preview raster; omitir = resolução cheia. */
  previewMaxWidth?: number;
}) {
  const parsed = parseBuilderAssetContent(content);
  const deferredPrimary = useDeferredValue(primary);
  const deferredSecondary = useDeferredValue(secondary);
  const [rasterSrc, setRasterSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const asset = parseBuilderAssetContent(content);
    if (asset.type !== "raster") {
      setRasterSrc(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setError(null);

    const maxW = previewMaxWidth;
    const applyColors = async () => {
      try {
        if (maxW) {
          const { dataUrl } = await recolorRasterPreviewToDataUrl(
            asset.src,
            deferredPrimary,
            deferredSecondary,
            maxW,
          );
          if (!cancelled) setRasterSrc(dataUrl);
          return;
        }
        const template = await getRasterRecolorTemplate(asset.src);
        if (cancelled) return;
        const { dataUrl } = recolorRasterTemplate(template, deferredPrimary, deferredSecondary);
        if (!cancelled) setRasterSrc(dataUrl);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Erro ao recolorir");
        }
      }
    };

    void applyColors();
    return () => {
      cancelled = true;
    };
  }, [content, deferredPrimary, deferredSecondary, previewMaxWidth]);

  if (parsed.type === "svg") {
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{
          __html: recolorSvg(parsed.value, deferredPrimary, deferredSecondary),
        }}
      />
    );
  }

  if (error) {
    return (
      <div
        className={`${className ?? ""} flex items-center justify-center bg-zinc-900 text-xs text-red-300`}
      >
        {error}
      </div>
    );
  }

  if (!rasterSrc) {
    return (
      <div
        className={`${className ?? ""} flex items-center justify-center bg-zinc-900 text-xs text-zinc-500`}
      >
        Carregando…
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={rasterSrc} alt={alt} className={className} />
  );
});
