"use client";

import Image, { type ImageProps } from "next/image";

type SalesImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fetchPriority?: "high" | "low" | "auto";
  sizes?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  style?: React.CSSProperties;
  quality?: number;
};

export default function SalesImage({
  src,
  alt,
  className,
  priority = false,
  fetchPriority,
  sizes = "(max-width: 768px) 100vw, 50vw",
  width,
  height,
  fill,
  style,
  quality,
}: SalesImageProps) {
  if (!src) return null;

  const q = quality ?? (priority ? 65 : 50);

  const shared: Pick<ImageProps, "src" | "alt" | "className" | "style" | "sizes" | "quality"> = {
    src,
    alt,
    className,
    style,
    sizes,
    quality: q,
  };

  if (fill) {
    return (
      <Image
        {...shared}
        fill
        priority={priority}
        fetchPriority={fetchPriority ?? (priority ? "high" : "low")}
        loading={priority ? undefined : "lazy"}
      />
    );
  }

  return (
    <Image
      {...shared}
      width={width ?? 800}
      height={height ?? 600}
      priority={priority}
      fetchPriority={fetchPriority ?? (priority ? "high" : "low")}
      loading={priority ? undefined : "lazy"}
    />
  );
}
