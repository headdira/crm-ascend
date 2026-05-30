-- Banners raster importados de /workspace/banners (PNG em apps/crm e apps/builder public/banners)

INSERT INTO builder_assets (asset_type, name, niche, svg_content, sort_order)
SELECT v.asset_type, v.name, v.niche, v.svg_content, v.sort_order
FROM (VALUES
  ('banner'::builder_asset_type, 'Pet — Banner 01', 'Pet', 'raster:/banners/pet-banner-01.png', 11),
  ('banner', 'Pet — Banner 02', 'Pet', 'raster:/banners/pet-banner-02.png', 12),
  ('banner', 'Pet — Banner 03', 'Pet', 'raster:/banners/pet-banner-03.png', 13),
  ('banner', 'Pet — Banner 04', 'Pet', 'raster:/banners/pet-banner-04.png', 14),
  ('banner', 'Pet — Banner 05', 'Pet', 'raster:/banners/pet-banner-05.png', 15),
  ('banner', 'Pet — Banner 06', 'Pet', 'raster:/banners/pet-banner-06.png', 16),
  ('banner', 'Pet — Banner 07', 'Pet', 'raster:/banners/pet-banner-07.png', 17),
  ('banner', 'Moda masculina — Banner 01', 'Moda masculina', 'raster:/banners/moda-masculina-banner-01.png', 11),
  ('banner', 'Moda masculina — Banner 02', 'Moda masculina', 'raster:/banners/moda-masculina-banner-02.png', 12),
  ('banner', 'Moda masculina — Banner 03', 'Moda masculina', 'raster:/banners/moda-masculina-banner-03.png', 13),
  ('banner', 'Moda masculina — Banner 04', 'Moda masculina', 'raster:/banners/moda-masculina-banner-04.png', 14),
  ('banner', 'Moda masculina — Banner 05', 'Moda masculina', 'raster:/banners/moda-masculina-banner-05.png', 15),
  ('banner', 'Moda masculina — Banner 06', 'Moda masculina', 'raster:/banners/moda-masculina-banner-06.png', 16),
  ('banner', 'Casa e praticidade — Banner 01', 'Casa e praticidade', 'raster:/banners/casa-banner-01.png', 1),
  ('banner', 'Casa e praticidade — Banner 02', 'Casa e praticidade', 'raster:/banners/casa-banner-02.png', 2),
  ('banner', 'Casa e praticidade — Banner 03', 'Casa e praticidade', 'raster:/banners/casa-banner-03.png', 3),
  ('banner', 'Casa e praticidade — Banner 04', 'Casa e praticidade', 'raster:/banners/casa-banner-04.png', 4),
  ('banner', 'Casa e praticidade — Banner 05', 'Casa e praticidade', 'raster:/banners/casa-banner-05.png', 5),
  ('banner', 'Casa e praticidade — Banner 06', 'Casa e praticidade', 'raster:/banners/casa-banner-06.png', 6),
  ('banner', 'Casa e praticidade — Banner 07', 'Casa e praticidade', 'raster:/banners/casa-banner-07.png', 7)
) AS v(asset_type, name, niche, svg_content, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM builder_assets b
  WHERE b.asset_type = v.asset_type AND b.svg_content = v.svg_content
);
