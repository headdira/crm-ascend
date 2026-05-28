-- PNGs do provisionamento (logo + banners) para URLs públicas na Nuvemshop

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'builder-theme',
  'builder-theme',
  true,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/webp']::text[]
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS builder_theme_public_read ON storage.objects;
CREATE POLICY builder_theme_public_read ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'builder-theme');

DROP POLICY IF EXISTS builder_theme_service_insert ON storage.objects;
CREATE POLICY builder_theme_service_insert ON storage.objects
  FOR INSERT
  TO service_role
  WITH CHECK (bucket_id = 'builder-theme');

DROP POLICY IF EXISTS builder_theme_service_update ON storage.objects;
CREATE POLICY builder_theme_service_update ON storage.objects
  FOR UPDATE
  TO service_role
  USING (bucket_id = 'builder-theme')
  WITH CHECK (bucket_id = 'builder-theme');

DROP POLICY IF EXISTS builder_theme_service_delete ON storage.objects;
CREATE POLICY builder_theme_service_delete ON storage.objects
  FOR DELETE
  TO service_role
  USING (bucket_id = 'builder-theme');

ALTER TABLE builder_submissions
  ADD COLUMN IF NOT EXISTS theme_assets jsonb;

CREATE OR REPLACE FUNCTION public.update_builder_submission_provision(
  p_id uuid,
  p_provision_status builder_provision_status,
  p_provision_job_id text DEFAULT NULL,
  p_provision_error text DEFAULT NULL,
  p_store_preview_url text DEFAULT NULL,
  p_nuvemshop_store_id text DEFAULT NULL,
  p_theme_assets jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE builder_submissions
  SET
    provision_status = p_provision_status,
    provision_job_id = COALESCE(p_provision_job_id, provision_job_id),
    provision_error = p_provision_error,
    store_preview_url = COALESCE(p_store_preview_url, store_preview_url),
    nuvemshop_store_id = COALESCE(p_nuvemshop_store_id, nuvemshop_store_id),
    theme_assets = COALESCE(p_theme_assets, theme_assets)
  WHERE id = p_id;
END;
$$;
