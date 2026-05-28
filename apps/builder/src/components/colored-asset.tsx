"use client";

import { useEffect, useState } from "react";
import { parseBuilderAssetContent, recolorSvg } from "@crm-ascend/validation";
import { recolorRasterToDataUrl } from "@/lib/recolor-raster";

export function ColoredAsset({
  content,
  primary,
  secondary,
  className,
  alt = "",
}: {
  content: string;
  primary: string;
  secondary: string;
  className?: string;
  alt?: string;
}) {
  const parsed = parseBuilderAssetContent(content);
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
    setRasterSrc(null);
    recolorRasterToDataUrl(asset.src, primary, secondary)
      .then(({ dataUrl }) => {
        if (!cancelled) setRasterSrc(dataUrl);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Erro ao recolorir");
      });
    return () => {
      cancelled = true;
    };
  }, [content, primary, secondary]);

  if (parsed.type === "svg") {
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: recolorSvg(parsed.value, primary, secondary) }}
      />
    );
  }

  if (error) {
    return (
      <div className={`${className ?? ""} flex items-center justify-center bg-zinc-900 text-xs text-red-300`}>
        {error}
      </div>
    );
  }

  if (!rasterSrc) {
    return (
      <div className={`${className ?? ""} flex items-center justify-center bg-zinc-900 text-xs text-zinc-500`}>
        Aplicando cores…
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={rasterSrc} alt={alt} className={className} />
  );
}
