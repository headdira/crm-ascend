-- One-off: força reprocessamento do theme_job 7fb2d85e-4b9e-4025-9236-913cbe7c89f8.
-- A 017 não casou porque o status atual não era 'failed' (provavelmente 'completed' /
-- 'running' órfão / 'pending' já zerado mas com erro). Esta força a transição.

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
 WHERE id = '7fb2d85e-4b9e-4025-9236-913cbe7c89f8';
