-- Landing: sessões, eventos (Meta CAPI-ready) e vínculo com leads

CREATE TABLE landing_sessions (
  id uuid PRIMARY KEY,
  first_seen timestamptz NOT NULL DEFAULT now(),
  last_seen timestamptz NOT NULL DEFAULT now(),
  ip_hash text,
  user_agent text,
  device text,
  os text,
  country text,
  city text,
  utm jsonb NOT NULL DEFAULT '{}',
  referrer text,
  landing_path text
);

CREATE INDEX landing_sessions_last_seen_idx ON landing_sessions (last_seen DESC);
CREATE INDEX landing_sessions_country_idx ON landing_sessions (country);

CREATE TABLE landing_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES landing_sessions (id) ON DELETE CASCADE,
  event_name text NOT NULL,
  event_id text NOT NULL,
  ts timestamptz NOT NULL DEFAULT now(),
  page text,
  payload jsonb NOT NULL DEFAULT '{}',
  meta_capi_status text NOT NULL DEFAULT 'skipped',
  meta_capi_error text,
  ga4_status text NOT NULL DEFAULT 'skipped',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT landing_events_session_event_id_unique UNIQUE (session_id, event_id)
);

CREATE INDEX landing_events_session_id_ts_idx ON landing_events (session_id, ts DESC);
CREATE INDEX landing_events_event_name_idx ON landing_events (event_name);
CREATE INDEX landing_events_meta_capi_status_idx ON landing_events (meta_capi_status)
  WHERE meta_capi_status = 'pending';

ALTER TABLE leads
  ADD COLUMN session_id uuid REFERENCES landing_sessions (id),
  ADD COLUMN reached_kiwify_at timestamptz,
  ADD COLUMN last_event_at timestamptz;

CREATE UNIQUE INDEX leads_session_id_unique ON leads (session_id) WHERE session_id IS NOT NULL;
CREATE INDEX leads_reached_kiwify_at_idx ON leads (reached_kiwify_at DESC)
  WHERE reached_kiwify_at IS NOT NULL;

ALTER TABLE landing_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY staff_read_landing_sessions ON landing_sessions
  FOR SELECT TO authenticated
  USING (is_active_staff());

CREATE POLICY staff_read_landing_events ON landing_events
  FOR SELECT TO authenticated
  USING (is_active_staff());
