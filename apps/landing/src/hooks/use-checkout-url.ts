"use client";

import { useEffect, useState } from "react";
import { buildCheckoutUrl } from "@/lib/sales/checkout";
import { CHECKOUT_URL } from "@/lib/sales/knowledge";

export function useCheckoutUrl() {
  const [url, setUrl] = useState(CHECKOUT_URL);

  useEffect(() => {
    setUrl(buildCheckoutUrl());
  }, []);

  return url;
}
