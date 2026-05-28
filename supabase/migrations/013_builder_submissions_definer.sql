-- Gravação de submissions pelo Builder (API pública) sem depender de service_role no PostgREST.

GRANT INSERT, UPDATE, SELECT ON TABLE public.builder_submissions TO anon, authenticated, service_role;

DROP POLICY IF EXISTS builder_submissions_public_insert ON builder_submissions;
CREATE POLICY builder_submissions_public_insert ON builder_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS builder_submissions_public_update ON builder_submissions;
CREATE POLICY builder_submissions_public_update ON builder_submissions
  FOR UPDATE TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.insert_builder_submission(
  p_store_name text,
  p_niche text,
  p_course_email text,
  p_store_email text,
  p_oauth_session_id text,
  p_payload jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
BEGIN
  INSERT INTO builder_submissions (
    store_name,
    niche,
    course_email,
    store_email,
    oauth_session_id,
    provision_status,
    payload
  ) VALUES (
    p_store_name,
    p_niche,
    p_course_email,
    p_store_email,
    p_oauth_session_id,
    'pending',
    COALESCE(p_payload, '{}'::jsonb)
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_builder_submission_provision(
  p_id uuid,
  p_provision_status builder_provision_status,
  p_provision_job_id text DEFAULT NULL,
  p_provision_error text DEFAULT NULL,
  p_store_preview_url text DEFAULT NULL,
  p_nuvemshop_store_id text DEFAULT NULL
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
    nuvemshop_store_id = COALESCE(p_nuvemshop_store_id, nuvemshop_store_id)
  WHERE id = p_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.insert_builder_submission TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.update_builder_submission_provision TO anon, authenticated, service_role;
