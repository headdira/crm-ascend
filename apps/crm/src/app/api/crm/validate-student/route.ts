import { createServiceSupabase } from "@crm-ascend/db";
import {
  hashDocument,
  hashEmail,
  hashPhone,
  validateStudentSchema,
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

  const parsed = validateStudentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const salt = getHashSalt();
  const supabase = createServiceSupabase();
  let hash: string;

  if (parsed.data.email) hash = hashEmail(parsed.data.email, salt);
  else if (parsed.data.phone) hash = hashPhone(parsed.data.phone, salt);
  else hash = hashDocument(parsed.data.document!, salt);

  const column = parsed.data.email
    ? "email_hash"
    : parsed.data.phone
      ? "phone_hash"
      : "document_hash";

  const { data: student } = await supabase
    .from("students")
    .select("id, status")
    .eq(column, hash)
    .maybeSingle();

  if (!student) {
    return NextResponse.json({ exists: false });
  }

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("id, product_id")
    .eq("student_id", student.id)
    .eq("status", "active");

  const productIds = [...new Set((enrollments ?? []).map((e) => e.product_id))];
  const { data: products } =
    productIds.length > 0
      ? await supabase.from("products").select("id, sku, name").in("id", productIds)
      : { data: [] };

  const productMap = new Map((products ?? []).map((p) => [p.id, p]));

  return NextResponse.json({
    exists: true,
    student_id: student.id,
    status: student.status,
    active_enrollments: (enrollments ?? []).map((e) => {
      const p = productMap.get(e.product_id);
      return {
        enrollment_id: e.id,
        product_sku: p?.sku ?? "",
        product_name: p?.name ?? "",
      };
    }),
  });
}
