/** Meta Pixel + Conversions API — variáveis de ambiente (nunca commitar tokens). */

export function getMetaPixelId(): string | null {
  const id =
    import.meta.env.PUBLIC_META_PIXEL_ID ??
    import.meta.env.META_PIXEL_ID ??
    (typeof process !== "undefined" ? process.env.PUBLIC_META_PIXEL_ID ?? process.env.META_PIXEL_ID : undefined);
  return id?.trim() || null;
}

export function getMetaCapiAccessToken(): string | null {
  const token =
    import.meta.env.META_CAPI_ACCESS_TOKEN ??
    (typeof process !== "undefined" ? process.env.META_CAPI_ACCESS_TOKEN : undefined);
  return token?.trim() || null;
}

export function getMetaTestEventCode(): string | null {
  const code =
    import.meta.env.META_TEST_EVENT_CODE ??
    (typeof process !== "undefined" ? process.env.META_TEST_EVENT_CODE : undefined);
  return code?.trim() || null;
}

export function isMetaCapiConfigured(): boolean {
  return Boolean(getMetaPixelId() && getMetaCapiAccessToken());
}
