import type { APIRoute } from "astro";
import { loadAdsQuizConfig } from "@/lib/sales/ads-quiz-config-server";

export const GET: APIRoute = async () => {
  const config = await loadAdsQuizConfig();
  if (!config) {
    return new Response(JSON.stringify({ error: "Quiz indisponível" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true, config }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    },
  });
};
