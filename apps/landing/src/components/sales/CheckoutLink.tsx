"use client";

import { useState, type ComponentProps } from "react";
import { useCheckoutUrl } from "@/hooks/use-checkout-url";
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
