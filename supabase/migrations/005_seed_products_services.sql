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
