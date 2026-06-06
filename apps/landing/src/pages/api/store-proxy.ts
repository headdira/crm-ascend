import type { APIRoute } from "astro";
import {
  parseStoreProxyTarget,
  rewriteStoreHtml,
} from "@/lib/sales/store-proxy";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const reqUrl = new URL(request.url);
  const target = parseStoreProxyTarget(reqUrl.searchParams.get("url"));

  if (!target) {
    return new Response("URL inválida ou não permitida", { status: 400 });
  }

  try {
    const upstream = await fetch(target.toString(), {
      headers: {
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        "User-Agent":
          "Mozilla/5.0 (compatible; AscendQuizStorePreview/1.0; +https://ascendclub.com.br)",
      },
      redirect: "follow",
    });

    const contentType = upstream.headers.get("content-type") ?? "";

    if (!contentType.includes("text/html")) {
      return Response.redirect(target.toString(), 302);
    }

    const html = await upstream.text();
    const proxyOrigin = `${reqUrl.protocol}//${reqUrl.host}`;
    const rewritten = rewriteStoreHtml(html, new URL(upstream.url), proxyOrigin);

    return new Response(rewritten, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "private, max-age=120",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Falha ao carregar loja";
    return new Response(message, { status: 502 });
  }
};
