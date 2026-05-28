import { createServiceSupabase } from "@crm-ascend/db";
import { NextResponse } from "next/server";
import { buildVisualFromSubmit, enqueueProvisionerJob } from "@/lib/provisioner";

/**
 * Reenfileira só a vitrine via Scripts API (theme_only) — sem CLI de tema.
 * Body: { submission_id, oauth_session_id }
 */
export async function POST(request: Request) {
  let body: { submission_id?: string; oauth_session_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.submission_id || !body.oauth_session_id) {
    return NextResponse.json(
      { error: "submission_id e oauth_session_id são obrigatórios" },
      { status: 400 },
    );
  }

  const supabase = createServiceSupabase();
  const { data: row, error: fetchErr } = await supabase
    .from("builder_submissions")
    .select("id, payload")
    .eq("id", body.submission_id)
    .single();

  if (fetchErr || !row?.payload || typeof row.payload !== "object") {
    return NextResponse.json({ error: "Submission não encontrada" }, { status: 404 });
  }

  const payload = row.payload as Record<string, unknown>;
  const storeName = String(payload.storeName ?? "");
  const niche = String(payload.niche ?? "");
  const primaryColor = String(payload.primaryColor ?? "#000000");
  const secondaryColor = String(payload.secondaryColor ?? "#ffffff");
  const fontId = String(payload.fontId ?? "montserrat");
  const logoSvg = String(payload.logoSvg ?? "");
  const bannerSvgs = Array.isArray(payload.bannerSvgs)
    ? payload.bannerSvgs.map(String)
    : [];

  if (!logoSvg || bannerSvgs.length < 1) {
    return NextResponse.json({ error: "Payload sem logo/banners SVG" }, { status: 400 });
  }

  const visual = buildVisualFromSubmit({
    storeName,
    niche,
    primaryColor,
    secondaryColor,
    fontId,
    logoSvg,
    bannerSvgs,
  });

  try {
    const job = await enqueueProvisionerJob({
      submissionId: row.id,
      oauthSessionId: body.oauth_session_id,
      visual,
      themeOnly: true,
    });

    await supabase.rpc("update_builder_submission_provision", {
      p_id: row.id,
      p_provision_status: "queued",
      p_provision_job_id: job.job_id,
      p_provision_error: null,
    });

    return NextResponse.json({
      submission_id: row.id,
      provision_job_id: job.job_id,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Falha ao enfileirar tema";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
