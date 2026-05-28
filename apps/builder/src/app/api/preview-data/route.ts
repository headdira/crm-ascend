import { getCrmUrl } from "@/lib/types";

export async function GET(request: Request) {
  const submissionId = new URL(request.url).searchParams.get("submission_id");
  if (!submissionId) {
    return Response.json({ error: "submission_id required" }, { status: 400 });
  }

  const res = await fetch(
    `${getCrmUrl()}/api/builder/preview-data?submission_id=${encodeURIComponent(submissionId)}`,
    { cache: "no-store" },
  );
  const data = await res.json().catch(() => ({}));
  return Response.json(data, { status: res.status });
}
