-- Quiz /form: oferta R$197 (de R$1.500) + checkout Ascend Flash Point
UPDATE form_definitions
SET schema = (
  SELECT
    jsonb_set(
      schema::jsonb,
      '{steps}',
      (
        SELECT jsonb_agg(
          CASE
            WHEN step->>'type' = 'offer' THEN
              step
              || jsonb_build_object('title', 'Seu plano Ascend')
              || jsonb_build_object('body', 'Pagamento único · 12 meses de acesso')
              || jsonb_build_object('priceLabel', 'R$197')
              || jsonb_build_object('originalPriceLabel', 'R$1.500')
              || jsonb_build_object('priceNote', 'ou 8x de R$16,49 no cartão')
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
