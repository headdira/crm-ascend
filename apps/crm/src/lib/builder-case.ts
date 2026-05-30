import { createServiceSupabase } from "@crm-ascend/db";
import { hashEmail } from "@crm-ascend/validation";
import { getHashSalt } from "@/lib/env";

const SERVICE_CODE = "LOJA-CUSTOMIZACAO";

function buildCaseDescription(params: {
  submissionId: string;
  storeName: string;
  niche: string;
  primaryColor: string;
  secondaryColor: string;
  nuvemshopLoginEmail: string;
  storeEmail: string;
  courseEmail?: string | null;
}): string {
  return [
    `Resposta do builder: ${params.submissionId}`,
    `Loja: ${params.storeName}`,
    `Nicho: ${params.niche}`,
    `Cor dos objetos: ${params.primaryColor}`,
    `Cor de fundo/destaque: ${params.secondaryColor}`,
    `E-mail login Nuvemshop: ${params.nuvemshopLoginEmail}`,
    `E-mail contato loja: ${params.storeEmail}`,
    params.courseEmail ? `E-mail curso: ${params.courseEmail}` : null,
    "",
    "Aplicar manualmente cores e banners escolhidos pelo cliente (prazo: 72h).",
    "Ver detalhes completos em CRM → Builder → Resposta.",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function createBuilderCustomizationCase(params: {
  submissionId: string;
  storeName: string;
  niche: string;
  storeEmail: string;
  courseEmail?: string | null;
  primaryColor: string;
  secondaryColor: string;
  nuvemshopLoginEmail: string;
}): Promise<string | null> {
  const supabase = createServiceSupabase();
  const salt = getHashSalt();
  const lookupEmail = params.courseEmail?.trim() || params.storeEmail;
  const emailHash = hashEmail(lookupEmail, salt);

  let studentId: string | null = null;

  const { data: existingStudent } = await supabase
    .from("students")
    .select("id")
    .eq("email_hash", emailHash)
    .maybeSingle();

  if (existingStudent) {
    studentId = existingStudent.id;
  } else {
    const { data: newStudent, error: studentErr } = await supabase
      .from("students")
      .insert({
        full_name: params.storeName,
        email_hash: emailHash,
        email: lookupEmail,
        status: "prospect",
        notes: `Criado automaticamente via Builder (${params.submissionId})`,
      })
      .select("id")
      .single();

    if (studentErr) {
      console.error(
        `[builder/case] Falha ao criar aluno para submission ${params.submissionId}:`,
        studentErr.message,
      );
      return null;
    }
    studentId = newStudent?.id ?? null;
  }

  if (!studentId) return null;

  const { data: service } = await supabase
    .from("services")
    .select("id, default_priority")
    .eq("code", SERVICE_CODE)
    .eq("is_active", true)
    .maybeSingle();

  if (!service) {
    console.error(`[builder/case] Serviço ${SERVICE_CODE} não encontrado`);
    return null;
  }

  const description = buildCaseDescription(params);

  const { data: newCase, error: caseErr } = await supabase
    .from("cases")
    .insert({
      student_id: studentId,
      service_id: service.id,
      subject: `Customização de loja: ${params.storeName}`,
      description,
      priority: service.default_priority,
      status: "new",
      builder_submission_id: params.submissionId,
    })
    .select("id")
    .single();

  if (caseErr || !newCase) {
    console.error(
      `[builder/case] Falha ao criar caso para submission ${params.submissionId}:`,
      caseErr?.message,
    );
    return null;
  }

  await supabase
    .from("builder_submissions")
    .update({ case_id: newCase.id })
    .eq("id", params.submissionId);

  return newCase.id;
}
