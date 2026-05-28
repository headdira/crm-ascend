-- Remove gender from builder logos (logos are categorized by niche only)

ALTER TABLE builder_assets DROP CONSTRAINT IF EXISTS builder_assets_logo_gender_chk;
DROP INDEX IF EXISTS builder_assets_type_gender_idx;
ALTER TABLE builder_assets DROP COLUMN IF EXISTS gender;
DROP TYPE IF EXISTS builder_logo_gender;
