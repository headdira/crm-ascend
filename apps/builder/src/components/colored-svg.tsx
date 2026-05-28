"use client";

import Image from "next/image";
import { LOGO_URL, SITE_NAME } from "@/lib/brand";
import { recolorSvg } from "@crm-ascend/validation";

export function ColoredSvg({
  svg,
  primary,
  secondary,
  className,
}: {
  svg: string;
  primary: string;
  secondary: string;
  className?: string;
}) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: recolorSvg(svg, primary, secondary) }}
    />
  );
}

/** Logo oficial Ascend (PNG com transparência) — mesma URL do CRM e da landing */
export function AscendLogoMark({ className }: { className?: string }) {
  return (
    <Image
      src={LOGO_URL}
      alt={SITE_NAME}
      width={200}
      height={56}
      className={className ?? "h-10 w-auto sm:h-12"}
      priority
    />
  );
}
