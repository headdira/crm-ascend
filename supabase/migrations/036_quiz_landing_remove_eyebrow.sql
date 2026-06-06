-- Remove badge "Diagnóstico gratuito · 2 minutos" da landing do quiz
UPDATE form_definitions
SET schema = jsonb_set(
  schema::jsonb,
  '{landing,eyebrow}',
  '""'
)
WHERE slug = 'ascend-ads';
