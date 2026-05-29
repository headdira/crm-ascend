"use client";

import { useState, type ComponentProps } from "react";
import { useCheckoutUrl } from "@/hooks/use-checkout-url";
import { ctaLabel } from "@/lib/sales/cta-labels";
import { trackMetaInitiateCheckout } from "@/lib/sales/meta-pixel-client";
import { trackEvent } from "@/lib/sales/track-client";
import CheckoutLeadModal from "./CheckoutLeadModal";

type Props = Omit<ComponentProps<"a">, "href"> & {
  trackLabel?: string;
};

export default function CheckoutLink({ trackLabel, onClick, children, ...rest }: Props) {
  const href = useCheckoutUrl();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault();
          const eventId = crypto.randomUUID();
          trackEvent("checkout_click", {
            cta: trackLabel,
            cta_label: ctaLabel(trackLabel),
            meta_event_id: eventId,
          });
          trackMetaInitiateCheckout(eventId, trackLabel);
          setModalOpen(true);
          onClick?.(e);
        }}
        {...rest}
      >
        {children}
      </a>
      <CheckoutLeadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        checkoutUrl={href}
        trackLabel={trackLabel}
      />
    </>
  );
}
