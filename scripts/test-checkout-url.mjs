/**
 * Smoke test: URL de checkout Kiwify deve incluir email, name, phone e region.
 * Run: node scripts/test-checkout-url.mjs
 */
const CHECKOUT_URL = "https://pay.kiwify.com.br/26ERa3r";

function buildPersonalizedCheckoutUrl(customer, attribution) {
  const url = new URL(CHECKOUT_URL);
  if (attribution) {
    for (const [key, value] of Object.entries(attribution)) {
      if (value) url.searchParams.set(key, value);
    }
  }
  url.searchParams.set("email", customer.email.trim().toLowerCase());
  url.searchParams.set("name", customer.name.trim());
  if (customer.phone) url.searchParams.set("phone", customer.phone.replace(/\D/g, ""));
  url.searchParams.set("region", "br");
  return url.toString();
}

const url = buildPersonalizedCheckoutUrl(
  { email: "Test@Example.com", name: "Joao", phone: "(11) 99999-9999" },
  { utm_source: "test" },
);

const parsed = new URL(url);
const checks = [
  ["email", "test@example.com"],
  ["name", "Joao"],
  ["phone", "11999999999"],
  ["region", "br"],
  ["utm_source", "test"],
];

let failed = false;
for (const [key, expected] of checks) {
  const got = parsed.searchParams.get(key);
  if (got !== expected) {
    console.error(`FAIL ${key}: expected "${expected}", got "${got}"`);
    failed = true;
  }
}

if (failed) {
  console.error("URL:", url);
  process.exit(1);
}

console.log("OK checkout URL:", url);
