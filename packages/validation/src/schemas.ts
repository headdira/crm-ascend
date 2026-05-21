import { z } from "zod";

const skuRegex = /^[A-Z0-9][A-Z0-9_-]*$/;

export const leadCreateSchema = z.object({
  full_name: z.string().min(2).max(200),
  email: z.string().email(),
  phone: z.string().optional(),
  source: z.enum(["landing", "manual", "import"]).default("manual"),
  utm: z.record(z.unknown()).optional(),
  quiz_answers: z.record(z.unknown()).optional(),
  owner_id: z.string().uuid().optional(),
});

export const leadUpdateSchema = leadCreateSchema
  .partial()
  .extend({
    status: z
      .enum(["new", "contacted", "qualified", "disqualified", "converted"])
      .optional(),
  });

export const leadConvertSchema = z.object({
  lead_id: z.string().uuid(),
  notes: z.string().optional(),
});

export const studentUpdateSchema = z.object({
  full_name: z.string().min(2).max(200).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  document: z.string().optional(),
  status: z.enum(["prospect", "active", "inactive"]).optional(),
  notes: z.string().optional(),
});

export const productCreateSchema = z.object({
  sku: z
    .string()
    .min(2)
    .max(64)
    .transform((s) => s.toUpperCase())
    .refine((s) => skuRegex.test(s), "SKU inválido"),
  name: z.string().min(2).max(200),
  product_type: z.enum(["course", "mentorship", "addon", "bundle", "other"]),
  description: z.string().max(5000).optional(),
  requires_product_id: z.string().uuid().nullable().optional(),
  metadata: z.record(z.unknown()).optional(),
  is_active: z.boolean().optional(),
});

export const productUpdateSchema = productCreateSchema.partial().omit({ sku: true });

export const contractLineSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.coerce.number().int().min(1).default(1),
  unit_price_cents: z.coerce.number().int().min(0),
});

export const contractCreateSchema = z
  .object({
    student_id: z.string().uuid(),
    starts_at: z.string().date(),
    ends_at: z.string().date(),
    notes: z.string().optional(),
    lines: z.array(contractLineSchema).min(1),
  })
  .refine((d) => d.ends_at > d.starts_at, {
    message: "ends_at deve ser posterior a starts_at",
    path: ["ends_at"],
  });

export const contractActivateSchema = z.object({
  contract_id: z.string().uuid(),
});

export const caseCreateSchema = z.object({
  student_id: z.string().uuid(),
  contract_id: z.string().uuid().optional(),
  service_id: z.string().uuid(),
  subject: z.string().min(3).max(300),
  description: z.string().max(10000).optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).optional(),
  owner_id: z.string().uuid().optional(),
});

export const caseCommentSchema = z.object({
  case_id: z.string().uuid(),
  body: z.string().min(1).max(10000),
  is_internal: z.boolean().optional(),
});

export const validateStudentSchema = z
  .object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    document: z.string().optional(),
  })
  .refine((d) => !!(d.email || d.phone || d.document), {
    message: "Informe email, phone ou document",
  });

export const validateEligibilitySchema = z.object({
  student_id: z.string().uuid(),
  product_sku: z.string().min(1),
});

export const formSubmitSchema = z.object({
  form_slug: z.string().min(1),
  identifier: z
    .object({
      email: z.string().email().optional(),
      phone: z.string().optional(),
      document: z.string().optional(),
    })
    .optional(),
  fields: z.record(z.unknown()).default({}),
  open_case: z.boolean().optional(),
  service_code: z.string().optional(),
});

export const serviceUpsertSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().min(2).max(64),
  name: z.string().min(2).max(200),
  default_priority: z.enum(["low", "medium", "high", "critical"]).optional(),
  is_active: z.boolean().optional(),
});
