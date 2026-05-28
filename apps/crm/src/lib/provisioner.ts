import { recolorSvg } from "@crm-ascend/validation";

export type ProvisionerVisual = {
  storeName: string;
  niche: string;
  primaryColor: string;
  secondaryColor: string;
  fontId: string;
  logoSvg: string;
  bannerSvgs: string[];
};

export async function enqueueProvisionerJob(params: {
  submissionId: string;
  oauthSessionId: string;
  visual: ProvisionerVisual;
  themeOnly?: boolean;
}) {
  const baseUrl = process.env.PROVISIONER_API_URL ?? "http://localhost:4010";
  const apiKey = process.env.PROVISIONER_API_KEY ?? "dev-provisioner-key";

  const res = await fetch(`${baseUrl}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    signal: AbortSignal.timeout(30_000),
    body: JSON.stringify({
      submission_id: params.submissionId,
      oauth_session_id: params.oauthSessionId,
      visual: params.visual,
      theme_only: params.themeOnly === true,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Provisioner ${res.status}: ${text}`);
  }

  return (await res.json()) as { job_id: string; status: string };
}

export function buildVisualFromSubmit(data: {
  storeName: string;
  niche: string;
  primaryColor: string;
  secondaryColor: string;
  fontId: string;
  logoSvg: string;
  bannerSvgs: string[];
}): ProvisionerVisual {
  return {
    storeName: data.storeName,
    niche: data.niche,
    primaryColor: data.primaryColor,
    secondaryColor: data.secondaryColor,
    fontId: data.fontId,
    logoSvg: recolorSvg(data.logoSvg, data.primaryColor, data.secondaryColor),
    bannerSvgs: data.bannerSvgs.map((svg) =>
      recolorSvg(svg, data.primaryColor, data.secondaryColor),
    ),
  };
}
