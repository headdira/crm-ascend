import { CHECKOUT_URL } from "./knowledge";
import { appendAttributionToUrl, readAttributionFromDocument } from "./utm";

export function buildCheckoutUrl(attribution = readAttributionFromDocument()): string {
  return appendAttributionToUrl(CHECKOUT_URL, attribution);
}
