"use client";

import type { ComponentProps } from "react";
import { useCheckoutUrl } from "@/hooks/use-checkout-url";

type Props = Omit<ComponentProps<"a">, "href"> & {
  trackLabel?: string;
};

export default function CheckoutLink({ trackLabel, onClick, children, ...rest }: Props) {
  const href = useCheckoutUrl();

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-track={trackLabel}
      onClick={(e) => {
        if (trackLabel && typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("ascend:cta_click", { detail: { label: trackLabel } }),
          );
        }
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
