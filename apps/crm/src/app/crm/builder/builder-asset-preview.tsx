"use client";

import { ColoredAsset } from "@/components/builder/colored-asset";

export function BuilderAssetPreview({
  content,
  primary = "#FFB800",
  secondary = "#0A0A0A",
}: {
  content: string;
  primary?: string;
  secondary?: string;
}) {
  return (
    <ColoredAsset
      content={content}
      primary={primary}
      secondary={secondary}
      className="bg-muted/30 h-16 w-28 rounded border object-contain p-0.5 [&_img]:h-full [&_img]:w-full [&_svg]:max-h-full [&_svg]:max-w-full"
    />
  );
}
