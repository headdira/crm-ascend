-- Corrige 017/018: o ID 7fb2d85e-4b9e-4025-9236-913cbe7c89f8 é builder_submissions.id
-- (e theme_jobs.submission_id), NÃO theme_jobs.id. Por isso 017/018 não atualizaram nada.
-- Job real: e1b4bdb7-a7fb-4e66-8c67-ae0057e850ff — ficou preso em 'running' porque o worker
-- morreu mid-job e nunca marcou completed/failed (sem heartbeat → claim_theme_job ignora).
-- Esta força status='pending' filtrando pelo submission_id, idempotente por status.

UPDATE theme_jobs
   SET status = 'pending',
       error = NULL,
       worker_id = NULL,
       picked_up_at = NULL,
       completed_at = NULL,
       installation_id = NULL,
       preview_url = NULL,
       asset_urls = NULL,
       attempts = 0
 WHERE submission_id = '7fb2d85e-4b9e-4025-9236-913cbe7c89f8'
   AND status IN ('running', 'failed');
