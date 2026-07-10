import type { APIRoute } from "astro";
import { loadQuizResume } from "@/lib/sales/quiz-resume-server";

export const GET: APIRoute = async ({ request }) => {
  try {
    const resume = await loadQuizResume(request);
    return new Response(JSON.stringify({ ok: true, ...resume }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err) {
    console.error("[api/quiz/resume]", err);
    return new Response(JSON.stringify({ ok: false, resumable: false }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
