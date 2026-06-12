-- Preenche campos obrigatórios de contact (idade e renda) ausentes no schema do quiz
UPDATE form_definitions
SET schema = jsonb_set(
  schema::jsonb,
  '{contact}',
  COALESCE(schema::jsonb->'contact', '{}'::jsonb)
    || '{
      "ageTitle": "Qual sua idade?",
      "ageHint": "Só pra encaixar o plano no seu momento de vida.",
      "incomeTitle": "Quanto você ganha hoje?",
      "incomeHint": "Valor mensal aproximado — sem julgamento."
    }'::jsonb
)
WHERE slug = 'ascend-ads';
