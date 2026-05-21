"use client";

import Image from "next/image";

type SalesImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  style?: React.CSSProperties;
};

export default function SalesImage({
  src,
  alt,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  width,
  height,
  fill,
  style,
}: SalesImageProps) {
  if (!src) return null;

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        style={style}
        sizes={sizes}
        priority={priority}
        quality={priority ? 75 : 60}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 800}
      height={height ?? 600}
      className={className}
      style={style}
      sizes={sizes}
      priority={priority}
      quality={priority ? 75 : 60}
      loading={priority ? undefined : "lazy"}
    />
  );
}
