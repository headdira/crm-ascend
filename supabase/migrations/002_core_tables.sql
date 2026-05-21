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
