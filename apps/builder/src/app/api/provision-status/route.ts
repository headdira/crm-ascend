import { getCrmUrl } from "@/lib/types";

export async function GET(request: Request) {
  const submissionId = new URL(request.url).searchParams.get("submission_id");
  if (!submissionId) {
    return Response.json({ error: "submission_id required" }, { status: 400 });
  }

  const res = await fetch(
    `${getCrmUrl()}/api/builder/provision-status?submission_id=${encodeURIComponent(submissionId)}`,
    { cache: "no-store" },
  );

  const body = await res.json().catch(() => ({}));
  return Response.json(body, { status: res.status });
}
