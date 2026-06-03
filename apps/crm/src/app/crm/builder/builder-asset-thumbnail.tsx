"use client";

import { memo } from "react";
import { parseBuilderAssetContent, recolorSvg } from "@crm-ascend/validation";

function rasterSrc(src: string): string {
  if (/^https?:\/\//i.test(src)) return src;
  const path = src.startsWith("/") ? src : `/${src.replace(/^\//, "")}`;
  if (typeof window !== "undefined") {
    return new URL(path, window.location.origin).href;
  }
  return path;
}

/** Preview leve para listagens — sem canvas/recolor (rápido). */
export const BuilderAssetThumbnail = memo(function BuilderAssetThumbnail({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const parsed = parseBuilderAssetContent(content);

  if (parsed.type === "raster") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={rasterSrc(parsed.src)}
        alt=""
        loading="lazy"
        decoding="async"
        className={className}
      />
    );
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{
        __html: recolorSvg(parsed.value, "#FFB800", "#1a1a1a"),
      }}
    />
  );
});
