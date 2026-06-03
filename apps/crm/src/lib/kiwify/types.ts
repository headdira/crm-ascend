export const KIWIFY_API_BASE = "https://public-api.kiwify.com/v1";

export const KIWIFY_WEBHOOK_TRIGGERS = [
  "boleto_gerado",
  "pix_gerado",
  "carrinho_abandonado",
  "compra_recusada",
  "compra_aprovada",
  "compra_reembolsada",
  "chargeback",
  "subscription_canceled",
  "subscription_late",
  "subscription_renewed",
] as const;

export type KiwifyWebhookTrigger = (typeof KIWIFY_WEBHOOK_TRIGGERS)[number];

export type KiwifyCustomer = {
  email: string;
  name: string;
  phone: string | null;
  cpf: string | null;
  cnpj: string | null;
  kiwifyCustomerId: string | null;
};

export type KiwifyProductRef = {
  id: string | null;
  name: string | null;
};

export type ParsedKiwifyWebhook = {
  eventType: KiwifyWebhookTrigger;
  orderId: string | null;
  reference: string | null;
  customer: KiwifyCustomer | null;
  product: KiwifyProductRef;
  chargeAmountCents: number | null;
  tracking: Record<string, string | null>;
};

export type KiwifyProcessResult = {
  ok: boolean;
  skipped?: boolean;
  studentId?: string;
  contractId?: string;
  caseId?: string;
  leadId?: string;
  message?: string;
};
