"use client";

import type { ComponentProps } from "react";
import { useCheckoutUrl } from "@/hooks/use-checkout-url";
import { trackEvent } from "@/lib/sales/track-client";

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
        if (typeof window !== "undefined") {
          trackEvent("InitiateCheckout", {
            label: trackLabel ?? "checkout",
            checkout_url: href,
          });
          if (trackLabel) {
            window.dispatchEvent(
              new CustomEvent("ascend:cta_click", { detail: { label: trackLabel } }),
            );
          }
        }
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
