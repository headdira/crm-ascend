-- CRM Ascend: Club Builder assets, settings and submissions

CREATE TYPE builder_asset_type AS ENUM ('logo', 'banner');

CREATE TABLE builder_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_type builder_asset_type NOT NULL,
  name text NOT NULL,
  niche text NOT NULL,
  svg_content text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX builder_assets_type_niche_idx ON builder_assets (asset_type, niche, is_active);

CREATE TABLE builder_settings (
  id int PRIMARY KEY CHECK (id = 1),
  youtube_url text,
  affiliate_url text DEFAULT 'https://exemplo.com/plano-afiliado',
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO builder_settings (id) VALUES (1);

CREATE TABLE builder_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payload jsonb NOT NULL DEFAULT '{}',
  store_name text,
  niche text,
  course_email text,
  store_email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX builder_submissions_created_at_idx ON builder_submissions (created_at DESC);

-- Seed sample recolorable SVG assets (#PRIMARY / #SECONDARY placeholders)

INSERT INTO builder_assets (asset_type, name, niche, svg_content, sort_order) VALUES
(
  'logo',
  'Escudo — Moda masculina',
  'Moda masculina',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><path d="M60 8L16 28v34c0 28 18 54 44 62 26-8 44-34 44-62V28L60 8z" fill="#SECONDARY"/><path d="M60 22L30 36v24c0 20 13 38 30 44 17-6 30-24 30-44V36L60 22z" fill="#PRIMARY"/><path d="M48 58h24v8H48z" fill="#SECONDARY"/></svg>',
  1
),
(
  'logo',
  'Monograma — Moda feminina',
  'Moda feminina',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><circle cx="60" cy="60" r="52" fill="#SECONDARY"/><circle cx="60" cy="60" r="40" fill="#PRIMARY"/><path d="M44 78c8-16 24-16 32 0" stroke="#SECONDARY" stroke-width="6" stroke-linecap="round"/><circle cx="48" cy="52" r="5" fill="#SECONDARY"/><circle cx="72" cy="52" r="5" fill="#SECONDARY"/></svg>',
  1
),
(
  'logo',
  'Marca — Genérico',
  'Genérico',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><rect x="12" y="12" width="96" height="96" rx="24" fill="#SECONDARY"/><rect x="24" y="24" width="72" height="72" rx="16" fill="#PRIMARY"/><path d="M40 60h40M60 40v40" stroke="#SECONDARY" stroke-width="8" stroke-linecap="round"/></svg>',
  1
),
(
  'logo',
  'Pata — Pet',
  'Pet',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><ellipse cx="60" cy="72" rx="36" ry="28" fill="#PRIMARY"/><circle cx="36" cy="44" r="14" fill="#SECONDARY"/><circle cx="84" cy="44" r="14" fill="#SECONDARY"/><circle cx="48" cy="28" r="10" fill="#SECONDARY"/><circle cx="72" cy="28" r="10" fill="#SECONDARY"/></svg>',
  1
);

INSERT INTO builder_assets (asset_type, name, niche, svg_content, sort_order) VALUES
(
  'banner',
  'Banner Moda feminina 1',
  'Moda feminina',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" fill="none"><rect width="640" height="400" fill="#SECONDARY"/><rect x="40" y="40" width="560" height="320" rx="16" fill="#PRIMARY" opacity="0.85"/><circle cx="520" cy="80" r="48" fill="#SECONDARY"/><path d="M80 280h480" stroke="#SECONDARY" stroke-width="12" stroke-linecap="round"/></svg>',
  1
),
(
  'banner',
  'Banner Moda masculina 1',
  'Moda masculina',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" fill="none"><rect width="640" height="400" fill="#PRIMARY"/><path d="M0 320L160 160 320 280 480 120 640 240V400H0z" fill="#SECONDARY" opacity="0.6"/><rect x="48" y="48" width="200" height="24" rx="4" fill="#SECONDARY"/></svg>',
  1
),
(
  'banner',
  'Banner Pet 1',
  'Pet',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" fill="none"><rect width="640" height="400" fill="#SECONDARY"/><ellipse cx="320" cy="220" rx="180" ry="120" fill="#PRIMARY"/><circle cx="240" cy="120" r="36" fill="#PRIMARY"/><circle cx="400" cy="120" r="36" fill="#PRIMARY"/></svg>',
  1
),
(
  'banner',
  'Banner Genérico 1',
  'Genérico',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" fill="none"><rect width="640" height="400" fill="#SECONDARY"/><rect x="0" y="280" width="640" height="120" fill="#PRIMARY"/><rect x="64" y="64" width="512" height="32" rx="8" fill="#PRIMARY"/></svg>',
  1
);

ALTER TABLE builder_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE builder_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE builder_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY builder_assets_public_read ON builder_assets
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY builder_assets_staff_all ON builder_assets
  FOR ALL TO authenticated
  USING (is_active_staff())
  WITH CHECK (is_active_staff());

CREATE POLICY builder_settings_public_read ON builder_settings
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY builder_settings_staff_update ON builder_settings
  FOR UPDATE TO authenticated
  USING (is_active_staff())
  WITH CHECK (is_active_staff());

CREATE POLICY builder_submissions_staff_all ON builder_submissions
  FOR ALL TO authenticated
  USING (is_active_staff())
  WITH CHECK (is_active_staff());
