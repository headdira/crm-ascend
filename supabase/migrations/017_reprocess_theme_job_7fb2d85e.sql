-- One-off: reenfileira o theme_job 7fb2d85e-4b9e-4025-9236-913cbe7c89f8 para o worker reprocessar.
-- Contexto: job parou em FAIL não-recuperável ("2 temas produtivos e nenhum ipanema sectionable")
-- porque a loja tinha 1 produtivo morelia + 1 draft morelia preso. Draft foi removido via
-- scripts/theme-installations.mjs (ascend-nuvemshop-provisioner) e o slot liberou.
-- Idempotente: WHERE só casa se ainda estiver failed; rodar de novo é noop.

UPDATE theme_jobs
   SET status = 'pending',
       error = NULL,
       worker_id = NULL,
       picked_up_at = NULL,
       completed_at = NULL,
       attempts = 0
 WHERE id = '7fb2d85e-4b9e-4025-9236-913cbe7c89f8'
   AND status = 'failed';
