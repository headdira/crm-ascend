import { describe, expect, it } from "vitest";
import { contractCreateSchema } from "@crm-ascend/validation";

describe("contractCreateSchema", () => {
  it("rejects ends_at before starts_at", () => {
    const result = contractCreateSchema.safeParse({
      student_id: "00000000-0000-4000-8000-000000000001",
      starts_at: "2025-12-01",
      ends_at: "2025-01-01",
      lines: [
        {
          product_id: "00000000-0000-4000-8000-000000000002",
          quantity: 1,
          unit_price_cents: 10000,
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("requires at least one line", () => {
    const result = contractCreateSchema.safeParse({
      student_id: "00000000-0000-4000-8000-000000000001",
      starts_at: "2025-01-01",
      ends_at: "2025-12-31",
      lines: [],
    });
    expect(result.success).toBe(false);
  });
});
