import { getProvisionerUrl } from "@/lib/types";

export async function GET(request: Request) {
  const oauthSessionId = new URL(request.url).searchParams.get("oauth_session_id");
  if (!oauthSessionId) {
    return Response.json({ error: "oauth_session_id required" }, { status: 400 });
  }

  const res = await fetch(
    `${getProvisionerUrl()}/theme-auth/status/${encodeURIComponent(oauthSessionId)}`,
    { cache: "no-store" },
  );
  const data = await res.json().catch(() => ({}));
  return Response.json(data, { status: res.status });
}
