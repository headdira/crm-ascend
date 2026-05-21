import { createServiceSupabase } from "@crm-ascend/db";
import { validateEligibilitySchema } from "@crm-ascend/validation";
import { NextResponse } from "next/server";
import { assertBuilderKey } from "@/lib/env";

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

  const parsed = validateEligibilitySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { student_id, product_sku } = parsed.data;
  const supabase = createServiceSupabase();

  const { data: product } = await supabase
    .from("products")
    .select("id, is_active, requires_product_id")
    .eq("sku", product_sku)
    .maybeSingle();

  if (!product || !product.is_active) {
    return NextResponse.json({ eligible: false, reason: "PRODUCT_NOT_FOUND" });
  }

  if (!product.requires_product_id) {
    return NextResponse.json({ eligible: true });
  }

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("student_id", student_id)
    .eq("product_id", product.requires_product_id)
    .eq("status", "active")
    .maybeSingle();

  if (!enrollment) {
    return NextResponse.json({ eligible: false, reason: "REQUIRES_ACTIVE_COURSE" });
  }

  return NextResponse.json({ eligible: true });
}
