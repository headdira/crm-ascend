-- Fila de jobs do tema CLI (@tiendanube/cli).
-- Worker local (apps/theme-worker no monorepo do provisioner) consome
-- e executa porque o pacote não roda no Vercel (puppeteer + pnpm symlinks).
-- Provisioner Vercel só enfileira; submission segue "completed" pelo baseline
-- e ganha theme_installation_id quando o worker termina.

CREATE TABLE IF NOT EXISTS theme_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES builder_submissions(id) ON DELETE CASCADE,
  store_id text NOT NULL,
  access_token text NOT NULL,
  theme_cli_token text NOT NULL,
  visual jsonb NOT NULL,
  theme_base text NOT NULL DEFAULT 'toluca',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','running','completed','failed')),
  worker_id text,
  attempts int NOT NULL DEFAULT 0,
  installation_id text,
  preview_url text,
  asset_urls jsonb,
  error text,
  picked_up_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS theme_jobs_pending_idx
  ON theme_jobs (status, created_at)
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS theme_jobs_submission_idx
  ON theme_jobs (submission_id);

ALTER TABLE theme_jobs ENABLE ROW LEVEL SECURITY;

-- Claim atômico: worker pega o job mais antigo pendente sem corrida.
CREATE OR REPLACE FUNCTION claim_theme_job(p_worker_id text)
RETURNS SETOF theme_jobs
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  UPDATE theme_jobs
     SET status = 'running',
         worker_id = p_worker_id,
         picked_up_at = now(),
         attempts = attempts + 1
   WHERE id = (
     SELECT id FROM theme_jobs
      WHERE status = 'pending'
      ORDER BY created_at
      FOR UPDATE SKIP LOCKED
      LIMIT 1
   )
  RETURNING *;
END;
$$;

REVOKE ALL ON FUNCTION claim_theme_job(text) FROM PUBLIC;
