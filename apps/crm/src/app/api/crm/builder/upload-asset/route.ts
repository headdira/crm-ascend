import { NextResponse } from "next/server";
import { getCurrentStaff } from "@/lib/auth";
import { processBuilderAssetUpload } from "@/lib/builder-upload-service";

export const runtime = "nodejs";
export const maxDuration = 60;

/** Upload de logos/banners — Route Handler evita limite de 1 MB das Server Actions. */
export async function POST(request: Request) {
  const staff = await getCurrentStaff();
  if (!staff?.is_active) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "FormData inválido" }, { status: 400 });
  }

  const result = await processBuilderAssetUpload(formData);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const { created, failed } = result.data;
  if (created.length === 0 && failed.length > 0) {
    return NextResponse.json(
      { error: failed[0]?.error ?? "Falha no upload", failed },
      { status: 422 },
    );
  }

  return NextResponse.json({
    created,
    failed,
    asset: created[0] ?? null,
  });
}
