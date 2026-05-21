import { createServiceSupabase, type Json } from "@crm-ascend/db";
import {
  formSubmitSchema,
  hashDocument,
  hashEmail,
  hashPhone,
} from "@crm-ascend/validation";
import { NextResponse } from "next/server";
import { assertBuilderKey, getHashSalt } from "@/lib/env";

export async function POST(request: Request) {
  if (!assertBuilderKey(request.headers.get("X-Builder-Key"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = formSubmitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = createServiceSupabase();
  const { form_slug, identifier, fields, open_case, service_code } = parsed.data;

  const { data: form } = await supabase
    .from("form_definitions")
    .select("id")
    .eq("slug", form_slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!form) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  let studentId: string | null = null;
  if (identifier && (identifier.email || identifier.phone || identifier.document)) {
    const salt = getHashSalt();
    let column: "email_hash" | "phone_hash" | "document_hash" = "email_hash";
    let hash = "";

    if (identifier.email) {
      hash = hashEmail(identifier.email, salt);
      column = "email_hash";
    } else if (identifier.phone) {
      hash = hashPhone(identifier.phone, salt);
      column = "phone_hash";
    } else {
      hash = hashDocument(identifier.document!, salt);
      column = "document_hash";
    }

    const { data: student } = await supabase
      .from("students")
      .select("id")
      .eq(column, hash)
      .maybeSingle();

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    studentId = student.id;
  }

  const { data: submission, error: subErr } = await supabase
    .from("form_submissions")
    .insert({
      form_id: form.id,
      student_id: studentId,
      payload: { fields, identifier_present: !!identifier } as Json,
    })
    .select()
    .single();

  if (subErr) {
    return NextResponse.json({ error: subErr.message }, { status: 500 });
  }

  let caseId: string | null = null;
  if (open_case && studentId && service_code) {
    const { data: service } = await supabase
      .from("services")
      .select("id, default_priority")
      .eq("code", service_code)
      .eq("is_active", true)
      .maybeSingle();

    if (service) {
      const { data: newCase } = await supabase
        .from("cases")
        .insert({
          student_id: studentId,
          service_id: service.id,
          subject: `Formulário: ${form_slug}`,
          description: JSON.stringify(fields),
          priority: service.default_priority,
          status: "new",
        })
        .select("id")
        .single();
      caseId = newCase?.id ?? null;
    }
  }

  return NextResponse.json({
    submission_id: submission.id,
    case_id: caseId,
  });
}
