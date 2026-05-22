-- Temperatura do lead na landing (funil frio → quente)
DO $$ BEGIN
  ALTER TYPE lead_status ADD VALUE 'frio';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TYPE lead_status ADD VALUE 'quente';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
