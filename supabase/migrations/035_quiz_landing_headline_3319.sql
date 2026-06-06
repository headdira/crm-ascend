-- Atualiza valor PIX semanal na headline do quiz /form
UPDATE form_definitions
SET schema = jsonb_set(
  schema::jsonb,
  '{landing,headline}',
  '"Você **não monta loja** nem caça produto — só vende. E pode receber até [[R$ 3.319/semana]] no **PIX**, com tudo pronto no nicho que escolher."'
)
WHERE slug = 'ascend-ads';
