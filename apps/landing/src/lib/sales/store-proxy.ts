/** Hosts permitidos no preview embutido do quiz (lojas de alunos). */
export const STORE_PROXY_ALLOWED_HOSTS = new Set([
  "www.lojaarven.com.br",
  "lojaarven.com.br",
  "usenivra.com",
  "www.usenivra.com",
  "www.sermentesaude.com",
  "sermentesaude.com",
]);

export function isStoreProxyHost(hostname: string): boolean {
  return STORE_PROXY_ALLOWED_HOSTS.has(hostname.toLowerCase());
}

export function parseStoreProxyTarget(raw: string | null): URL | null {
  if (!raw?.trim()) return null;
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (!isStoreProxyHost(url.hostname)) return null;
    return url;
  } catch {
    return null;
  }
}

export function buildStoreProxyPath(target: string, origin = ""): string {
  const base = origin || (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}/api/store-proxy?url=${encodeURIComponent(target)}`;
}

export function rewriteStoreHtml(html: string, pageUrl: URL, proxyOrigin: string): string {
  const proxyBase = `${proxyOrigin}/api/store-proxy`;
  const storeOrigin = `${pageUrl.origin}/`;

  let out = html
    .replace(/<meta[^>]+http-equiv=["']Content-Security-Policy["'][^>]*>/gi, "")
    .replace(/<meta[^>]+http-equiv=["']X-Frame-Options["'][^>]*>/gi, "")
    .replace(/<base[^>]*>/gi, "");

  out = out.replace(/href=(["'])([^"']+)\1/gi, (_match, quote: string, href: string) => {
    if (href.startsWith("#") || href.startsWith("javascript:") || href.startsWith("mailto:")) {
      return `href=${quote}${href}${quote}`;
    }
    try {
      const resolved = new URL(href, pageUrl);
      if (isStoreProxyHost(resolved.hostname)) {
        return `href=${quote}${proxyBase}?url=${encodeURIComponent(resolved.toString())}${quote}`;
      }
    } catch {
      /* keep original */
    }
    return `href=${quote}${href}${quote}`;
  });

  out = out.replace(/<head([^>]*)>/i, `<head$1><base href="${storeOrigin}">`);

  return out;
}
