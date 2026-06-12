-- Quiz /form: oferta R$49,99 enxuta + contact completo
UPDATE form_definitions
SET schema = (
  SELECT
    jsonb_set(
      jsonb_set(
        jsonb_set(
          schema::jsonb,
          '{result}',
          '{
            "eyebrow": "",
            "headline": "Seu plano está liberado",
            "highlights": []
          }'::jsonb
        ),
        '{contact}',
        COALESCE(schema::jsonb->'contact', '{}'::jsonb)
          || '{
            "ageTitle": "Qual sua idade?",
            "ageHint": "Só pra encaixar o plano no seu momento de vida.",
            "incomeTitle": "Quanto você ganha hoje?",
            "incomeHint": "Valor mensal aproximado — sem julgamento."
          }'::jsonb
      ),
      '{steps}',
      (
        SELECT jsonb_agg(
          CASE
            WHEN step->>'type' = 'offer' THEN
              step
              || jsonb_build_object('title', 'Seu plano Ascend')
              || jsonb_build_object('body', 'Pagamento único · 12 meses de acesso')
              || jsonb_build_object('priceLabel', 'R$49,99')
              || jsonb_build_object('originalPriceLabel', 'R$197')
              || jsonb_build_object('priceNote', 'ou 8x de R$6,25 no cartão')
              || jsonb_build_object('ctaLabel', 'LIBERAR MEU ACESSO')
              || jsonb_build_object('bullets', '["Loja pronta + mentoria ao vivo"]'::jsonb)
              - 'urgencyNote'
            ELSE step
          END
        )
        FROM jsonb_array_elements(schema::jsonb->'steps') AS step
      )
    )
)
WHERE slug = 'ascend-ads';
