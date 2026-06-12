-- Atualiza preço da oferta no quiz /form para R$49,99
UPDATE form_definitions
SET schema = (
  SELECT jsonb_set(
    schema::jsonb,
    '{steps}',
    (
      SELECT jsonb_agg(
        CASE
          WHEN step->>'type' = 'offer' THEN
            step
            || jsonb_build_object('priceLabel', 'R$49,99')
            || jsonb_build_object('originalPriceLabel', 'R$197')
            || jsonb_build_object('priceNote', 'Menos de R$0,14 por dia · loja + mentoria 1 ano')
          ELSE step
        END
      )
      FROM jsonb_array_elements(schema::jsonb->'steps') AS step
    )
  )
)
WHERE slug = 'ascend-ads';
