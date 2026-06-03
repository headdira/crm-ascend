import { CHECKOUT_URL } from "./knowledge";
import { appendAttributionToUrl, readAttributionFromDocument, type Attribution } from "./utm";

export type CheckoutCustomerPrefill = {
  email: string;
  name: string;
  phone?: string;
};

export function buildPersonalizedCheckoutUrl(
  customer: CheckoutCustomerPrefill,
  attribution?: Attribution | null,
): string {
  const base = appendAttributionToUrl(CHECKOUT_URL, attribution ?? null);
  const url = new URL(base);
  url.searchParams.set("email", customer.email.trim().toLowerCase());
  url.searchParams.set("name", customer.name.trim());
  if (customer.phone) {
    url.searchParams.set("phone", customer.phone.replace(/\D/g, ""));
  }
  url.searchParams.set("region", "br");
  return url.toString();
}
