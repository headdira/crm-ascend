"use client";

import { useEffect } from "react";
import { ATTRIBUTION_COOKIE } from "@/lib/sales/consent";
import {
  readAttributionFromSearch,
  serializeAttribution,
  setClientCookie,
} from "@/lib/sales/utm";

const MAX_AGE = 60 * 60 * 24 * 30;

export default function AttributionCapture() {
  useEffect(() => {
    const data = readAttributionFromSearch(window.location.search, window.location.pathname);
    if (data) {
      setClientCookie(ATTRIBUTION_COOKIE, serializeAttribution(data), MAX_AGE);
    }
  }, []);

  return null;
}
