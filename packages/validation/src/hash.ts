import { createHash } from "crypto";

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

export function normalizeDocument(value: string): string {
  return value.replace(/\D/g, "");
}

export function hashIdentifier(value: string, salt: string): string {
  return createHash("sha256").update(`${value}${salt}`).digest("hex");
}

export function hashEmail(email: string, salt: string): string {
  return hashIdentifier(normalizeEmail(email), salt);
}

export function hashPhone(phone: string, salt: string): string {
  return hashIdentifier(normalizePhone(phone), salt);
}

export function hashDocument(document: string, salt: string): string {
  return hashIdentifier(normalizeDocument(document), salt);
}
