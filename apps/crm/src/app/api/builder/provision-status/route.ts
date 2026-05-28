import { createServiceSupabase } from "@crm-ascend/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const submissionId = new URL(request.url).searchParams.get("submission_id");
  if (!submissionId) {
    return NextResponse.json({ error: "submission_id required" }, { status: 400 });
  }

  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("builder_submissions")
    .select(
      "id, provision_status, provision_error, provision_job_id, store_preview_url, nuvemshop_store_id",
    )
    .eq("id", submissionId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    submission_id: data.id,
    status: data.provision_status,
    error: data.provision_error,
    job_id: data.provision_job_id,
    preview_url: data.store_preview_url,
    store_id: data.nuvemshop_store_id,
  });
}
