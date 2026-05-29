import { createHash } from "node:crypto";

/** SHA-256 hex — formato exigido pela Meta Conversions API. */
export function hashMetaValue(value: string): string {
  return createHash("sha256").update(value.trim()).digest("hex");
}

export function normalizeMetaEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Dígitos com DDI 55 quando for número BR de 10–11 dígitos. */
export function normalizeMetaPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length >= 10 && digits.length <= 11 && !digits.startsWith("55")) {
    return `55${digits}`;
  }
  return digits;
}

export function hashMetaEmail(email: string): string {
  return hashMetaValue(normalizeMetaEmail(email));
}

export function hashMetaPhone(phone: string): string {
  const normalized = normalizeMetaPhone(phone);
  if (!normalized) return "";
  return hashMetaValue(normalized);
}

export function hashMetaFirstName(name: string): string {
  const first = name.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
  return first ? hashMetaValue(first) : "";
}

export function hashMetaExternalId(id: string): string {
  return hashMetaValue(id.trim());
}
