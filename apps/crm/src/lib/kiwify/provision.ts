import type { Json } from "@crm-ascend/db";
import { createServiceSupabase } from "@crm-ascend/db";
import { hashEmail, hashPhone } from "@crm-ascend/validation";
import { getHashSalt } from "@/lib/env";
import type { ParsedKiwifyWebhook, KiwifyProcessResult } from "@/lib/kiwify/types";

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function oneYearLaterIsoDate(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
}

async function resolveProductId(
  supabase: ReturnType<typeof createServiceSupabase>,
  kiwifyProductId: string | null,
): Promise<string | null> {
  if (kiwifyProductId) {
    const { data: mapped } = await supabase
      .from("products")
      .select("id")
      .eq("is_active", true)
      .contains("metadata", { kiwify_product_id: kiwifyProductId })
      .maybeSingle();
    if (mapped?.id) return mapped.id;
  }

  const { data: fallback } = await supabase
    .from("products")
    .select("id")
    .eq("sku", "CURSO-BASE")
    .eq("is_active", true)
    .maybeSingle();

  return fallback?.id ?? null;
}

async function findLeadByEmail(
  supabase: ReturnType<typeof createServiceSupabase>,
  emailHash: string,
) {
  const { data } = await supabase
    .from("leads")
    .select("*")
    .eq("email_hash", emailHash)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

export async function provisionKiwifySale(
  parsed: ParsedKiwifyWebhook,
): Promise<KiwifyProcessResult> {
  if (!parsed.customer?.email) {
    return { ok: false, message: "Webhook sem e-mail do cliente" };
  }

  const supabase = createServiceSupabase();
  const salt = getHashSalt();
  const emailHash = hashEmail(parsed.customer.email, salt);
  const phoneHash = parsed.customer.phone ? hashPhone(parsed.customer.phone, salt) : null;

  const existingEvent = parsed.orderId
    ? await supabase
        .from("kiwify_webhook_events")
        .select("id, result")
        .eq("kiwify_order_id", parsed.orderId)
        .eq("event_type", "compra_aprovada")
        .not("processed_at", "is", null)
        .maybeSingle()
    : { data: null };

  if (existingEvent.data?.result) {
    return { ...(existingEvent.data.result as KiwifyProcessResult), ok: true, skipped: true };
  }

  const lead = await findLeadByEmail(supabase, emailHash);

  let studentId: string | null = null;
  const { data: existingStudent } = await supabase
    .from("students")
    .select("id, status, converted_from_lead_id")
    .eq("email_hash", emailHash)
    .maybeSingle();

  if (existingStudent) {
    studentId = existingStudent.id;
  } else {
    const { data: student, error: studentErr } = await supabase
      .from("students")
      .insert({
        full_name: parsed.customer.name,
        email_hash: emailHash,
        phone_hash: phoneHash,
        email: parsed.customer.email,
        phone: parsed.customer.phone,
        status: "prospect",
        converted_from_lead_id: lead?.id ?? null,
        notes: parsed.orderId ? `Kiwify order ${parsed.orderId}` : null,
      })
      .select("id")
      .single();

    if (studentErr || !student) {
      return { ok: false, message: studentErr?.message ?? "Erro ao criar aluno" };
    }
    studentId = student.id;
  }

  const productId = await resolveProductId(supabase, parsed.product.id);
  if (!productId) {
    return { ok: false, message: "Produto CRM não mapeado para Kiwify" };
  }

  const unitPriceCents = parsed.chargeAmountCents ?? 0;
  const startsAt = todayIsoDate();
  const endsAt = oneYearLaterIsoDate();

  const { data: contract, error: contractErr } = await supabase
    .from("contracts")
    .insert({
      student_id: studentId,
      starts_at: startsAt,
      ends_at: endsAt,
      notes: [
        parsed.orderId ? `Kiwify order: ${parsed.orderId}` : null,
        parsed.reference ? `Ref: ${parsed.reference}` : null,
        parsed.product.name ? `Produto: ${parsed.product.name}` : null,
      ]
        .filter(Boolean)
        .join(" | "),
      total_amount_cents: unitPriceCents,
      status: "draft",
      created_by: null,
    })
    .select("id")
    .single();

  if (contractErr || !contract) {
    return { ok: false, message: contractErr?.message ?? "Erro ao criar contrato" };
  }

  const { data: line, error: lineErr } = await supabase
    .from("contract_lines")
    .insert({
      contract_id: contract.id,
      product_id: productId,
      quantity: 1,
      unit_price_cents: unitPriceCents,
    })
    .select("id, product_id")
    .single();

  if (lineErr || !line) {
    return { ok: false, message: lineErr?.message ?? "Erro ao criar linha do contrato" };
  }

  const now = new Date().toISOString();
  const { error: activateErr } = await supabase
    .from("contracts")
    .update({ status: "active" })
    .eq("id", contract.id);

  if (activateErr) {
    return { ok: false, message: activateErr.message };
  }

  const { error: enrollErr } = await supabase.from("enrollments").insert({
    student_id: studentId,
    product_id: line.product_id,
    contract_line_id: line.id,
    status: "active",
    starts_at: now,
    ends_at: `${endsAt}T23:59:59Z`,
  });

  if (enrollErr) {
    await supabase.from("contracts").update({ status: "draft" }).eq("id", contract.id);
    return { ok: false, message: enrollErr.message };
  }

  await supabase
    .from("students")
    .update({ status: "active" })
    .eq("id", studentId)
    .eq("status", "prospect");

  const { data: onboardingService } = await supabase
    .from("services")
    .select("id, default_priority")
    .eq("code", "ONBOARDING")
    .eq("is_active", true)
    .maybeSingle();

  let caseId: string | null = null;
  if (onboardingService) {
    const { data: newCase } = await supabase
      .from("cases")
      .insert({
        student_id: studentId,
        contract_id: contract.id,
        service_id: onboardingService.id,
        subject: `Onboarding Kiwify: ${parsed.product.name ?? "compra"}`,
        description: JSON.stringify({
          kiwify_order_id: parsed.orderId,
          reference: parsed.reference,
          tracking: parsed.tracking,
        }),
        priority: onboardingService.default_priority,
        status: "new",
        owner_id: null,
      })
      .select("id")
      .single();
    caseId = newCase?.id ?? null;
  }

  if (lead && lead.status !== "converted") {
    await supabase
      .from("leads")
      .update({
        status: "converted",
        converted_student_id: studentId,
        last_event_at: now,
        quiz_answers: {
          ...(typeof lead.quiz_answers === "object" && lead.quiz_answers
            ? (lead.quiz_answers as Record<string, unknown>)
            : {}),
          kiwify_purchased_at: now,
          kiwify_order_id: parsed.orderId,
        } as Json,
      })
      .eq("id", lead.id);
  }

  return {
    ok: true,
    studentId,
    contractId: contract.id,
    caseId: caseId ?? undefined,
    leadId: lead?.id,
  };
}

export async function enrichLeadFromKiwifyEvent(
  parsed: ParsedKiwifyWebhook,
  eventLabel: string,
): Promise<KiwifyProcessResult> {
  if (!parsed.customer?.email) {
    return { ok: false, message: "Webhook sem e-mail — lead não atualizado" };
  }

  const supabase = createServiceSupabase();
  const salt = getHashSalt();
  const emailHash = hashEmail(parsed.customer.email, salt);
  const now = new Date().toISOString();

  const quizPatch = {
    kiwify_last_event: eventLabel,
    kiwify_last_event_at: now,
    kiwify_order_id: parsed.orderId,
    kiwify_product_id: parsed.product.id,
    kiwify_product_name: parsed.product.name,
  };

  const lead = await findLeadByEmail(supabase, emailHash);

  if (lead) {
    const mergedQuiz = {
      ...(typeof lead.quiz_answers === "object" && lead.quiz_answers
        ? (lead.quiz_answers as Record<string, unknown>)
        : {}),
      ...quizPatch,
      ...(eventLabel === "carrinho_abandonado" ? { kiwify_abandoned_at: now } : {}),
    };

    await supabase
      .from("leads")
      .update({
        status: lead.status === "converted" ? "converted" : "quente",
        last_event_at: now,
        utm: mergeUtm(lead.utm, parsed.tracking),
        quiz_answers: mergedQuiz as Json,
        phone_enc: lead.phone_enc ?? parsed.customer.phone,
        phone_hash: lead.phone_hash ?? (parsed.customer.phone ? hashPhone(parsed.customer.phone, salt) : null),
      })
      .eq("id", lead.id);

    return { ok: true, leadId: lead.id };
  }

  const { data: created, error } = await supabase
    .from("leads")
    .insert({
      full_name: parsed.customer.name,
      email_hash: emailHash,
      phone_hash: parsed.customer.phone ? hashPhone(parsed.customer.phone, salt) : null,
      email_enc: parsed.customer.email,
      phone_enc: parsed.customer.phone,
      source: "kiwify",
      status: "quente",
      last_event_at: now,
      utm: parsed.tracking as Json,
      quiz_answers: {
        ...quizPatch,
        ...(eventLabel === "carrinho_abandonado" ? { kiwify_abandoned_at: now } : {}),
      } as Json,
    })
    .select("id")
    .single();

  if (error || !created) {
    return { ok: false, message: error?.message ?? "Erro ao criar lead" };
  }

  return { ok: true, leadId: created.id };
}

function mergeUtm(existing: Json, tracking: Record<string, string | null>): Json {
  const base =
    typeof existing === "object" && existing && !Array.isArray(existing)
      ? (existing as Record<string, unknown>)
      : {};

  const next = { ...base };
  for (const [key, value] of Object.entries(tracking)) {
    if (value) next[key] = value;
  }
  return next as Json;
}

export async function suspendEnrollmentForKiwifyOrder(
  orderId: string | null,
  reason: string,
): Promise<KiwifyProcessResult> {
  if (!orderId) {
    return { ok: false, message: "order_id ausente para suspensão" };
  }

  const supabase = createServiceSupabase();
  const { data: contracts } = await supabase
    .from("contracts")
    .select("id, student_id")
    .ilike("notes", `%${orderId}%`);

  if (!contracts?.length) {
    return { ok: true, skipped: true, message: "Contrato não encontrado para order" };
  }

  for (const contract of contracts) {
    await supabase.from("contracts").update({ status: "suspended" }).eq("id", contract.id);
    await supabase
      .from("enrollments")
      .update({ status: "suspended" })
      .eq("student_id", contract.student_id);

    const { data: finService } = await supabase
      .from("services")
      .select("id, default_priority")
      .eq("code", "FIN-BOLETO")
      .maybeSingle();

    if (finService) {
      await supabase.from("cases").insert({
        student_id: contract.student_id,
        contract_id: contract.id,
        service_id: finService.id,
        subject: `Kiwify: ${reason}`,
        description: JSON.stringify({ kiwify_order_id: orderId }),
        priority: "high",
        status: "new",
      });
    }
  }

  return { ok: true, message: `Suspensão aplicada (${contracts.length} contrato(s))` };
}
