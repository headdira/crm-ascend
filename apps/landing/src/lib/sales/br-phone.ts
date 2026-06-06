/** Máscara genérica — sem número real. */
export const BR_MOBILE_PHONE_PLACEHOLDER = "(00) 00000-0000";

export function stripPhoneDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatBrazilMobilePhone(value: string): string {
  const digits = stripPhoneDigits(value).slice(0, 11);
  if (!digits) return "";

  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);

  if (digits.length <= 2) {
    return digits.length === 2 ? `(${ddd}) ` : `(${ddd}`;
  }

  if (rest.length <= 5) return `(${ddd}) ${rest}`;
  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
}

export function isValidBrazilMobilePhone(value: string): boolean {
  const digits = stripPhoneDigits(value);
  if (digits.length !== 11) return false;

  const ddd = Number.parseInt(digits.slice(0, 2), 10);
  if (!Number.isFinite(ddd) || ddd < 11 || ddd > 99) return false;

  return digits[2] === "9";
}
