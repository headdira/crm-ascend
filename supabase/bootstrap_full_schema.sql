-- ========== 001_init_enums.sql ==========
-- CRM Ascend: enums
CREATE TYPE lead_status AS ENUM (
  'new',
  'contacted',
  'qualified',
  'disqualified',
  'converted'
);

CREATE TYPE student_status AS ENUM (
  'prospect',
  'active',
  'inactive'
);

CREATE TYPE product_type AS ENUM (
  'course',
  'mentorship',
  'addon',
  'bundle',
  'other'
);

CREATE TYPE contract_status AS ENUM (
  'draft',
  'active',
  'suspended',
  'ended',
  'cancelled'
);

CREATE TYPE enrollment_status AS ENUM (
  'pending',
  'active',
  'suspended',
  'ended'
);

CREATE TYPE case_status AS ENUM (
  'new',
  'in_progress',
  'waiting_customer',
  'resolved',
  'closed'
);

CREATE TYPE case_priority AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

CREATE TYPE staff_role AS ENUM (
  'admin',
  'sales',
  'support',
  'finance',
  'read_only'
);


-- ========== 002_core_tables.sql ==========
-- CRM Ascend: core tables

CREATE TABLE staff_users (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL DEFAULT '',
  role staff_role NOT NULL DEFAULT 'read_only',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email_hash text NOT NULL,
  phone_hash text,
  document_hash text,
  email text,
  phone text,
  document text,
  status student_status NOT NULL DEFAULT 'prospect',
  converted_from_lead_id uuid,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT students_email_hash_unique UNIQUE (email_hash)
);

CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email_hash text NOT NULL,
  phone_hash text,
  email_enc text,
  phone_enc text,
  source text NOT NULL DEFAULT 'manual',
  utm jsonb NOT NULL DEFAULT '{}',
  quiz_answers jsonb NOT NULL DEFAULT '{}',
  status lead_status NOT NULL DEFAULT 'new',
  owner_id uuid REFERENCES staff_users (id),
  converted_student_id uuid REFERENCES students (id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE students
  ADD CONSTRAINT students_converted_from_lead_id_fkey
  FOREIGN KEY (converted_from_lead_id) REFERENCES leads (id);

CREATE INDEX leads_email_hash_idx ON leads (email_hash);
CREATE INDEX leads_phone_hash_idx ON leads (phone_hash);
CREATE INDEX leads_status_idx ON leads (status);
CREATE INDEX leads_created_at_idx ON leads (created_at DESC);

CREATE INDEX students_email_hash_idx ON students (email_hash);
CREATE INDEX students_phone_hash_idx ON students (phone_hash);
CREATE INDEX students_status_idx ON students (status);

CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku text NOT NULL UNIQUE,
  name text NOT NULL,
  product_type product_type NOT NULL,
  description text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  requires_product_id uuid REFERENCES products (id),
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students (id),
  status contract_status NOT NULL DEFAULT 'draft',
  starts_at date NOT NULL,
  ends_at date NOT NULL,
  total_amount_cents integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'BRL',
  notes text,
  created_by uuid REFERENCES staff_users (id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT contracts_ends_after_starts CHECK (ends_at > starts_at)
);

CREATE TABLE contract_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid NOT NULL REFERENCES contracts (id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products (id),
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price_cents integer NOT NULL CHECK (unit_price_cents >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students (id),
  product_id uuid NOT NULL REFERENCES products (id),
  contract_line_id uuid REFERENCES contract_lines (id),
  status enrollment_status NOT NULL DEFAULT 'pending',
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX enrollments_student_product_idx ON enrollments (student_id, product_id);
CREATE INDEX enrollments_status_idx ON enrollments (status);

CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  default_priority case_priority NOT NULL DEFAULT 'medium',
  is_active boolean NOT NULL DEFAULT true
);

CREATE TABLE cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students (id),
  contract_id uuid REFERENCES contracts (id),
  service_id uuid NOT NULL REFERENCES services (id),
  subject text NOT NULL,
  description text NOT NULL DEFAULT '',
  status case_status NOT NULL DEFAULT 'new',
  priority case_priority NOT NULL DEFAULT 'medium',
  owner_id uuid REFERENCES staff_users (id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

CREATE INDEX cases_status_idx ON cases (status);
CREATE INDEX cases_student_id_idx ON cases (student_id);

CREATE TABLE case_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES cases (id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES staff_users (id),
  body text NOT NULL,
  is_internal boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- updated_at triggers
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER contracts_updated_at BEFORE UPDATE ON contracts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER enrollments_updated_at BEFORE UPDATE ON enrollments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER cases_updated_at BEFORE UPDATE ON cases
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ========== 003_form_tables.sql ==========
-- CRM Ascend: form builder tables (schema only in Phase 1)

CREATE TABLE form_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  schema jsonb NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true
);

CREATE TABLE form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES form_definitions (id),
  student_id uuid REFERENCES students (id),
  payload jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX form_submissions_form_id_idx ON form_submissions (form_id);
CREATE INDEX form_submissions_student_id_idx ON form_submissions (student_id);


-- ========== 004_rls_policies.sql ==========
-- CRM Ascend: RLS policies

ALTER TABLE staff_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Helper: active staff check
CREATE OR REPLACE FUNCTION is_active_staff()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM staff_users su
    WHERE su.id = auth.uid()
      AND su.is_active = true
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION is_admin_staff()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM staff_users su
    WHERE su.id = auth.uid()
      AND su.is_active = true
      AND su.role = 'admin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- staff_users
CREATE POLICY staff_users_select_own ON staff_users
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR is_admin_staff());

CREATE POLICY staff_users_update_own ON staff_users
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Generic staff access for CRM tables
CREATE POLICY staff_all_leads ON leads
  FOR ALL TO authenticated
  USING (is_active_staff())
  WITH CHECK (is_active_staff());

CREATE POLICY staff_all_students ON students
  FOR ALL TO authenticated
  USING (is_active_staff())
  WITH CHECK (is_active_staff());

CREATE POLICY staff_all_products ON products
  FOR ALL TO authenticated
  USING (is_active_staff())
  WITH CHECK (is_active_staff());

CREATE POLICY staff_all_contracts ON contracts
  FOR ALL TO authenticated
  USING (is_active_staff())
  WITH CHECK (is_active_staff());

CREATE POLICY staff_all_contract_lines ON contract_lines
  FOR ALL TO authenticated
  USING (is_active_staff())
  WITH CHECK (is_active_staff());

CREATE POLICY staff_all_enrollments ON enrollments
  FOR ALL TO authenticated
  USING (is_active_staff())
  WITH CHECK (is_active_staff());

CREATE POLICY staff_all_services ON services
  FOR ALL TO authenticated
  USING (is_active_staff())
  WITH CHECK (is_active_staff());

CREATE POLICY staff_all_cases ON cases
  FOR ALL TO authenticated
  USING (is_active_staff())
  WITH CHECK (is_active_staff());

CREATE POLICY staff_all_case_comments ON case_comments
  FOR ALL TO authenticated
  USING (is_active_staff())
  WITH CHECK (is_active_staff());

CREATE POLICY staff_all_form_definitions ON form_definitions
  FOR ALL TO authenticated
  USING (is_active_staff())
  WITH CHECK (is_active_staff());

CREATE POLICY staff_all_form_submissions ON form_submissions
  FOR ALL TO authenticated
  USING (is_active_staff())
  WITH CHECK (is_active_staff());

-- Grants
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;


-- ========== 005_seed_products_services.sql ==========
-- CRM Ascend: seed products and services

INSERT INTO products (sku, name, product_type, description, is_active, metadata)
VALUES (
  'CURSO-BASE',
  'Curso Base',
  'course',
  'Produto âncora — curso inicial Ascend',
  true,
  '{"carga_horaria": 40}'::jsonb
);

INSERT INTO products (sku, name, product_type, description, is_active, requires_product_id, metadata)
SELECT
  'MENT-1:1',
  'Mentoria Individual',
  'mentorship',
  'Mentoria 1:1 para alunos do curso base',
  true,
  p.id,
  '{}'::jsonb
FROM products p
WHERE p.sku = 'CURSO-BASE';

INSERT INTO services (code, name, default_priority, is_active)
VALUES
  ('FIN-BOLETO', 'Financeiro', 'medium', true),
  ('PED-SUPORTE', 'Pedagógico', 'medium', true),
  ('COMERCIAL', 'Comercial', 'medium', true);

INSERT INTO form_definitions (slug, name, schema, is_active)
VALUES (
  'mentoria-interesse',
  'Interesse em Mentoria',
  '{"fields": []}'::jsonb,
  true
);


-- ========== 006_landing_tracking.sql ==========
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


