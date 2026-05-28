-- Builder: provisionamento Nuvemshop via serviço externo

CREATE TYPE builder_provision_status AS ENUM (
  'pending',
  'queued',
  'running',
  'completed',
  'failed'
);

ALTER TABLE builder_submissions
  ADD COLUMN IF NOT EXISTS oauth_session_id text,
  ADD COLUMN IF NOT EXISTS provision_status builder_provision_status NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS provision_job_id text,
  ADD COLUMN IF NOT EXISTS provision_error text,
  ADD COLUMN IF NOT EXISTS store_preview_url text,
  ADD COLUMN IF NOT EXISTS nuvemshop_store_id text;

CREATE INDEX IF NOT EXISTS builder_submissions_provision_status_idx
  ON builder_submissions (provision_status, created_at DESC);
