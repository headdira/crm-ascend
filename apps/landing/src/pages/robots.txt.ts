import type { APIRoute } from "astro";
import { getSiteUrl } from "@/lib/site-url";

export const GET: APIRoute = () => {
  const base = getSiteUrl();
  const body = `User-agent: *
Allow: /
Allow: /conhecimento
Allow: /privacidade

Sitemap: ${base}/sitemap.xml
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
};
