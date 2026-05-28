-- Banner Pet variação 1: template raster (JPEG em escala de cinza) recolorido no builder.
-- Arquivo estático: apps/builder/public/banners/pet-variacao-1.jpg (e cópia em apps/crm/public)

INSERT INTO builder_assets (asset_type, name, niche, svg_content, sort_order) VALUES
(
  'banner',
  'Pet — Variação 1',
  'Pet',
  'raster:/banners/pet-variacao-1.jpg',
  0
)
