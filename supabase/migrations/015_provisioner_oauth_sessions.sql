-- Sessões OAuth do provisioner (Vercel serverless — não usar só memória/ /tmp)
CREATE TABLE IF NOT EXISTS provisioner_oauth_sessions (
  id uuid PRIMARY KEY,
  store_id text NOT NULL,
  access_token text NOT NULL,
  theme_cli_token text,
  created_at timestamptz NOT NULL DEFAULT now(),
  mock boolean NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS provisioner_oauth_pending (
  state uuid PRIMARY KEY,
  return_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_provisioner_oauth_pending_created
  ON provisioner_oauth_pending (created_at);

ALTER TABLE provisioner_oauth_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE provisioner_oauth_pending ENABLE ROW LEVEL SECURITY;
