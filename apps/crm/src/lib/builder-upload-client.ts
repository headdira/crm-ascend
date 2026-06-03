import type { UploadedBuilderAsset } from "@/lib/builder-upload";

export type BuilderUploadApiResponse = {
  created: UploadedBuilderAsset[];
  failed: Array<{ name: string; error: string }>;
  asset: UploadedBuilderAsset | null;
};

export async function postBuilderAssetUpload(
  formData: FormData,
): Promise<BuilderUploadApiResponse> {
  const res = await fetch("/api/crm/builder/upload-asset", {
    method: "POST",
    body: formData,
  });

  let payload: BuilderUploadApiResponse & { error?: string; failed?: BuilderUploadApiResponse["failed"] };
  try {
    payload = (await res.json()) as typeof payload;
  } catch {
    throw new Error(res.status === 413 ? "Arquivo grande demais para o servidor" : "Falha no upload");
  }

  if (!res.ok) {
    throw new Error(payload.error ?? `Upload falhou (${res.status})`);
  }

  return payload;
}
