import { createServiceSupabase, type Json } from "@crm-ascend/db";
import {
  builderSubmitSchema,
  formatBuilderSubmitErrors,
  youtubeEmbedUrl,
} from "@crm-ascend/validation";
import { waitUntil } from "@vercel/functions";
import { NextResponse } from "next/server";
import { enqueueProvisionerJob } from "@/lib/provisioner";

export const maxDuration = 60;

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
    const flat = parsed.error.flatten();
    return NextResponse.json(
      { error: flat, message: formatBuilderSubmitErrors(flat) },
      { status: 400 },
    );
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

  const enqueueTask = enqueueProvisionerJob({
    submissionId: submission.id,
    oauthSessionId: data.oauthSessionId,
  })
    .then(async (job) => {
      await supabase.rpc("update_builder_submission_provision", {
        p_id: submission.id,
        p_provision_status: "queued",
        p_provision_job_id: job.job_id,
      });
      return job.job_id;
    })
    .catch(async (e) => {
      const provisionError =
        e instanceof Error ? e.message : "Falha ao enfileirar provisionamento";
      await supabase.rpc("update_builder_submission_provision", {
        p_id: submission.id,
        p_provision_status: "failed",
        p_provision_error: provisionError,
      });
      return null;
    });

  try {
    waitUntil(enqueueTask);
  } catch {
    void enqueueTask;
  }

  return NextResponse.json({
    submission_id: submission.id,
    provision_status: "queued",
    message:
      "Respostas salvas. A loja está sendo montada em segundo plano — acompanhe o status na próxima tela.",
  });
}
