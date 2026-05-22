"use client";

type SalesImageProps = {
  src: string;
  webpSrc?: string;
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
  webpSrc,
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

  const imgProps = {
    alt,
    className,
    sizes,
    loading: (priority ? "eager" : "lazy") as "eager" | "lazy",
    decoding: "async" as const,
    fetchPriority: (priority ? "high" : "auto") as "high" | "auto",
  };

  if (fill) {
    const fillStyle = {
      ...style,
      objectFit: "cover" as const,
      width: "100%",
      height: "100%",
      position: "absolute" as const,
      inset: 0,
    };
    if (webpSrc) {
      return (
        <picture>
          <source srcSet={webpSrc} type="image/webp" />
          <img src={src} {...imgProps} style={fillStyle} />
        </picture>
      );
    }
    return <img src={src} {...imgProps} style={fillStyle} />;
  }

  if (webpSrc) {
    return (
      <picture>
        <source srcSet={webpSrc} type="image/webp" />
        <img src={src} width={width ?? 800} height={height ?? 600} {...imgProps} style={style} />
      </picture>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width ?? 800}
      height={height ?? 600}
      className={className}
      style={style}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
    />
  );
}
