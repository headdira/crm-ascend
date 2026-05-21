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
