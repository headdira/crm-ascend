import { createServiceSupabase, type Json } from "@crm-ascend/db";
import { builderSubmitSchema, youtubeEmbedUrl } from "@crm-ascend/validation";
import { NextResponse } from "next/server";
import { buildVisualFromSubmit, enqueueProvisionerJob } from "@/lib/provisioner";

export async function GET() {
  const supabase = createServiceSupabase();

  const [{ data: assets, error: assetsErr }, { data: settings, error: settingsErr }] =
    await Promise.all([
      supabase
        .from("builder_assets")
        .select("id, asset_type, name, niche, svg_content, sort_order")
        .eq("is_active", true)
        .order("sort_order")
        .order("name"),
      supabase.from("builder_settings").select("youtube_url, affiliate_url").eq("id", 1).single(),
    ]);

  if (assetsErr || settingsErr) {
    return NextResponse.json(
      { error: assetsErr?.message ?? settingsErr?.message ?? "Failed to load catalog" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    logos: (assets ?? []).filter((a) => a.asset_type === "logo"),
    banners: (assets ?? []).filter((a) => a.asset_type === "banner"),
    youtube_embed_url: youtubeEmbedUrl(settings?.youtube_url),
    affiliate_url: settings?.affiliate_url ?? "https://exemplo.com/plano-afiliado",
  });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = builderSubmitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = createServiceSupabase();
  const data = parsed.data;

  const { data: submissionId, error: insertError } = await supabase.rpc(
    "insert_builder_submission",
    {
      p_store_name: data.storeName,
      p_niche: data.niche,
      p_course_email: data.courseEmail || null,
      p_store_email: data.storeEmail,
      p_oauth_session_id: data.oauthSessionId,
      p_payload: data as unknown as Json,
    },
  );

  if (insertError || !submissionId) {
    return NextResponse.json(
      { error: insertError?.message ?? "Falha ao salvar submission" },
      { status: 500 },
    );
  }

  const submission = { id: submissionId as string };

  let jobId: string | null = null;
  let provisionError: string | null = null;

  try {
    const visual = buildVisualFromSubmit({
      storeName: data.storeName,
      niche: data.niche,
      primaryColor: data.primaryColor,
      secondaryColor: data.secondaryColor,
      fontId: data.fontId,
      logoSvg: data.logoSvg,
      bannerSvgs: data.bannerSvgs,
    });
    const job = await enqueueProvisionerJob({
      submissionId: submission.id,
      oauthSessionId: data.oauthSessionId,
      visual,
    });
    jobId = job.job_id;
    await supabase.rpc("update_builder_submission_provision", {
      p_id: submission.id,
      p_provision_status: "queued",
      p_provision_job_id: job.job_id,
    });
  } catch (e) {
    provisionError = e instanceof Error ? e.message : "Falha ao enfileirar provisionamento";
    await supabase.rpc("update_builder_submission_provision", {
      p_id: submission.id,
      p_provision_status: "failed",
      p_provision_error: provisionError,
    });
  }

  return NextResponse.json({
    submission_id: submission.id,
    provision_job_id: jobId,
    provision_error: provisionError,
  });
}
