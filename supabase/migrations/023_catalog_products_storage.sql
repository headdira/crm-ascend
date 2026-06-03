-- Imagens públicas do catálogo Ascend (produtos por nicho, API catalog-api)

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'catalog-products',
  'catalog-products',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS catalog_products_public_read ON storage.objects;
CREATE POLICY catalog_products_public_read ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'catalog-products');

DROP POLICY IF EXISTS catalog_products_service_insert ON storage.objects;
CREATE POLICY catalog_products_service_insert ON storage.objects
  FOR INSERT
  TO service_role
  WITH CHECK (bucket_id = 'catalog-products');

DROP POLICY IF EXISTS catalog_products_service_update ON storage.objects;
CREATE POLICY catalog_products_service_update ON storage.objects
  FOR UPDATE
  TO service_role
  USING (bucket_id = 'catalog-products')
  WITH CHECK (bucket_id = 'catalog-products');

DROP POLICY IF EXISTS catalog_products_service_delete ON storage.objects;
CREATE POLICY catalog_products_service_delete ON storage.objects
  FOR DELETE
  TO service_role
  USING (bucket_id = 'catalog-products');
