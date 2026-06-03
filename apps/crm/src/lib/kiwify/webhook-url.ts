import { getKiwifyWebhookToken } from "@/lib/env";

export function buildKiwifyWebhookPublicUrl(baseUrl: string): string {
  const token = getKiwifyWebhookToken();
  const url = new URL("/api/webhooks/kiwify", baseUrl.replace(/\/$/, ""));
  url.searchParams.set("token", token);
  return url.toString();
}
