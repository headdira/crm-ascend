import { getClientCookie, setClientCookie } from "./utm";

const FBC_MAX_AGE = 60 * 60 * 24 * 90; // 90 dias — alinhado à janela Meta

/** Grava cookie _fbc no formato Meta quando há fbclid na URL. */
export function ensureFbcCookieFromFbclid(fbclid: string): void {
  if (typeof document === "undefined") return;
  if (getClientCookie("_fbc")) return;
  const fbc = `fb.1.${Date.now()}.${fbclid}`;
  setClientCookie("_fbc", fbc, FBC_MAX_AGE);
}

export function getMetaBrowserIds(): { fbp?: string; fbc?: string } {
  if (typeof document === "undefined") return {};
  const fbp = getClientCookie("_fbp");
  const fbc = getClientCookie("_fbc");
  return {
    ...(fbp ? { fbp } : {}),
    ...(fbc ? { fbc } : {}),
  };
}
