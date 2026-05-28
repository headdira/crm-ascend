-- Builder público envia submissions sem login; a API do CRM deve usar service_role,
-- mas esta policy evita bloqueio se a chave do servidor estiver incorreta em dev.

CREATE POLICY builder_submissions_public_insert ON builder_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
