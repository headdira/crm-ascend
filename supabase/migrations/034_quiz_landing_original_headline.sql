-- Headline original (sem clone Bottrel / sem "sócio" / sem "Club")
UPDATE form_definitions
SET schema = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          schema::jsonb,
          '{landing,eyebrow}',
          '"Diagnóstico gratuito · 2 minutos"'
        ),
        '{landing,headline}',
        '"Você **não monta loja** nem caça produto — só vende. E pode receber até [[R$ 2.554/semana]] no **PIX**, com tudo pronto no nicho que escolher."'
      ),
      '{landing,subheadline}',
      '"Responda o quiz e veja se o modelo encaixa no seu perfil: loja entregue, produtos selecionados e mentoria ao vivo quando travar — mesmo zerado, sem aparecer e sem gastar com anúncio."'
    ),
    '{landing,ctaLabel}',
    '"QUERO MEU DIAGNÓSTICO"'
  ),
  '{landing,socialProof}',
  '"847 pessoas já fizeram · loja pronta + suporte ao vivo"'
)
WHERE slug = 'ascend-ads';
