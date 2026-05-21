import { describe, expect, it } from "vitest";
import {
  hashDocument,
  hashEmail,
  hashPhone,
  normalizeEmail,
  normalizePhone,
} from "./hash";

describe("hashIdentifier", () => {
  const salt = "test-salt";

  it("normalizes email before hashing", () => {
    const a = hashEmail("  Test@Email.COM  ", salt);
    const b = hashEmail("test@email.com", salt);
    expect(a).toBe(b);
    expect(normalizeEmail("  Test@Email.COM  ")).toBe("test@email.com");
  });

  it("normalizes phone to digits", () => {
    const a = hashPhone("(11) 98765-4321", salt);
    const b = hashPhone("11987654321", salt);
    expect(a).toBe(b);
    expect(normalizePhone("(11) 98765-4321")).toBe("11987654321");
  });

  it("normalizes CPF document", () => {
    const a = hashDocument("123.456.789-00", salt);
    const b = hashDocument("12345678900", salt);
    expect(a).toBe(b);
  });
});
