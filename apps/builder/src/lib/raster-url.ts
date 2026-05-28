/** Converte `raster:/banners/foo.jpg` ou `/banners/foo.jpg` em URL absoluta. */
export function resolveRasterAssetUrl(src: string): string {
  const path = src.startsWith("/") ? src : `/${src.replace(/^\//, "")}`;

  if (typeof window !== "undefined") {
    return new URL(path, window.location.origin).href;
  }

  const crm =
    process.env.NEXT_PUBLIC_CRM_URL?.replace(/\/$/, "") ??
    process.env.CRM_URL?.replace(/\/$/, "");
  return crm ? `${crm}${path}` : path;
}

/** URLs para tentar carregar (local public → CRM na Vercel). */
export function rasterAssetUrlCandidates(src: string): string[] {
  const path = src.startsWith("/") ? src : `/${src.replace(/^\//, "")}`;
  const urls: string[] = [];

  if (typeof window !== "undefined") {
    urls.push(new URL(path, window.location.origin).href);
  }

  const crm = process.env.NEXT_PUBLIC_CRM_URL?.replace(/\/$/, "");
  if (crm) {
    const crmUrl = `${crm}${path}`;
    if (!urls.includes(crmUrl)) urls.push(crmUrl);
  }

  if (urls.length === 0) urls.push(path);
  return urls;
}
