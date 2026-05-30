import { createServiceSupabase, type Json } from "@crm-ascend/db";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  builderSubmitSchema,
  formatBuilderSubmitErrors,
  youtubeEmbedUrl,
} from "@crm-ascend/validation";
import { NextResponse } from "next/server";
import { enqueueProvisionerJob } from "@/lib/provisioner";
import { createBuilderCustomizationCase } from "@/lib/builder-case";

type ProvisionPatch = {
  id: string;
  status: "queued" | "failed" | "completed";
  jobId?: string | null;
  error?: string | null;
  previewUrl?: string | null;
  storeId?: string | null;
};

/**
 * Atualização robusta: RPC primeiro (definer + canonical) → se falhar, PATCH
 * direto na tabela. Evita silenciar erros (estava deixando status="pending").
 */
async function persistProvisionUpdate(
  supabase: SupabaseClient,
  patch: ProvisionPatch,
): Promise<{ ok: boolean; via: "rpc" | "patch" | "none"; error?: string }> {
  const rpcPayload: Record<string, unknown> = {
    p_id: patch.id,
    p_provision_status: patch.status,
  };
  if (patch.jobId !== undefined) rpcPayload.p_provision_job_id = patch.jobId;
  if (patch.error !== undefined) rpcPayload.p_provision_error = patch.error;
  if (patch.previewUrl !== undefined) rpcPayload.p_store_preview_url = patch.previewUrl;
  if (patch.storeId !== undefined) rpcPayload.p_nuvemshop_store_id = patch.storeId;

  const { error: rpcErr } = await supabase.rpc(
    "update_builder_submission_provision",
    rpcPayload,
  );
  if (!rpcErr) return { ok: true, via: "rpc" };

  console.error(
    `[provision] RPC update_builder_submission_provision falhou (id=${patch.id}): ${rpcErr.message}`,
  );

  const directSet: Record<string, unknown> = { provision_status: patch.status };
  if (patch.jobId !== undefined) directSet.provision_job_id = patch.jobId;
  if (patch.error !== undefined) directSet.provision_error = patch.error;
  if (patch.previewUrl !== undefined) directSet.store_preview_url = patch.previewUrl;
  if (patch.storeId !== undefined) directSet.nuvemshop_store_id = patch.storeId;

  const { error: patchErr } = await supabase
    .from("builder_submissions")
    .update(directSet)
    .eq("id", patch.id);

  if (patchErr) {
    console.error(
      `[provision] PATCH fallback também falhou (id=${patch.id}): ${patchErr.message}`,
    );
    return { ok: false, via: "none", error: patchErr.message };
  }
  console.warn(`[provision] OK via PATCH direto — RPC está quebrada (id=${patch.id})`);
  return { ok: true, via: "patch" };
}

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

  let provisionStatus: "queued" | "failed" = "queued";
  let provisionError: string | null = null;
  let provisionJobId: string | null = null;

  try {
    const job = await enqueueProvisionerJob({
      submissionId: submission.id,
      oauthSessionId: data.oauthSessionId,
    });
    provisionJobId = job.job_id;
    await persistProvisionUpdate(supabase, {
      id: submission.id,
      status: "queued",
      jobId: job.job_id,
    });
  } catch (e) {
    provisionStatus = "failed";
    provisionError =
      e instanceof Error ? e.message : "Falha ao enfileirar provisionamento";
    console.error(
      `[builder/catalog] enqueue falhou para submission ${submission.id}:`,
      provisionError,
    );
    await persistProvisionUpdate(supabase, {
      id: submission.id,
      status: "failed",
      error: provisionError,
    });
  }

  let caseId: string | null = null;
  try {
    caseId = await createBuilderCustomizationCase({
      submissionId: submission.id,
      storeName: data.storeName,
      niche: data.niche,
      storeEmail: data.storeEmail,
      courseEmail: data.courseEmail,
      primaryColor: data.primaryColor,
      secondaryColor: data.secondaryColor,
      nuvemshopLoginEmail: data.nuvemshopLoginEmail,
    });
  } catch (e) {
    console.error(
      `[builder/catalog] Falha ao criar caso para submission ${submission.id}:`,
      e instanceof Error ? e.message : e,
    );
  }

  return NextResponse.json({
    submission_id: submission.id,
    case_id: caseId,
    provision_status: provisionStatus,
    provision_error: provisionError,
    provision_job_id: provisionJobId,
    message:
      provisionStatus === "queued"
        ? "Respostas salvas. Nossa equipe vai personalizar sua loja em até 72 horas."
        : "Respostas salvas. Nossa equipe foi notificada para a customização manual.",
  });
}
