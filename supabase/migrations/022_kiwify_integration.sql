-- Kiwify → CRM: event log, onboarding service, product mapping

CREATE TABLE kiwify_webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key text NOT NULL UNIQUE,
  event_type text NOT NULL,
  kiwify_order_id text,
  payload jsonb NOT NULL,
  result jsonb NOT NULL DEFAULT '{}',
  error text,
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX kiwify_webhook_events_order_id_idx ON kiwify_webhook_events (kiwify_order_id)
  WHERE kiwify_order_id IS NOT NULL;
CREATE INDEX kiwify_webhook_events_event_type_idx ON kiwify_webhook_events (event_type);
CREATE INDEX kiwify_webhook_events_created_at_idx ON kiwify_webhook_events (created_at DESC);

ALTER TABLE kiwify_webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY staff_read_kiwify_webhook_events ON kiwify_webhook_events
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM staff_users s
      WHERE s.id = auth.uid() AND s.is_active = true
    )
  );

INSERT INTO services (code, name, default_priority, is_active)
VALUES ('ONBOARDING', 'Onboarding', 'high', true)
ON CONFLICT (code) DO NOTHING;

UPDATE products
SET metadata = metadata || '{"kiwify_product_id": "65eda610-30a0-11f1-ad3b-012b67ada7e3"}'::jsonb
WHERE sku = 'CURSO-BASE';

UPDATE products
SET metadata = metadata || '{"kiwify_product_id": "3da84790-42ad-11f1-94b4-edbc875c7d4e"}'::jsonb
WHERE sku = 'MENT-1:1';
