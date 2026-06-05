import type { APIRoute } from "astro";
import { getSiteUrl } from "@/lib/site-url";

export const GET: APIRoute = () => {
  const base = getSiteUrl();
  const now = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${base}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>1</priority></url>
  <url><loc>${base}/form</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>${base}/conhecimento</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.85</priority></url>
  <url><loc>${base}/privacidade</loc><lastmod>${now}</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
};
