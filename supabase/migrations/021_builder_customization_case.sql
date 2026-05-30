-- Serviço e vínculo caso ↔ resposta do builder (customização manual de loja)

INSERT INTO services (code, name, default_priority, is_active)
VALUES ('LOJA-CUSTOMIZACAO', 'Customização de loja', 'high', true)
ON CONFLICT (code) DO NOTHING;

ALTER TABLE cases
  ADD COLUMN IF NOT EXISTS builder_submission_id uuid REFERENCES builder_submissions (id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS cases_builder_submission_id_idx ON cases (builder_submission_id);

ALTER TABLE builder_submissions
  ADD COLUMN IF NOT EXISTS case_id uuid REFERENCES cases (id) ON DELETE SET NULL;
