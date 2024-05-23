-- Up Migration

ALTER TABLE jobs
    DROP COLUMN IF EXISTS output_url;

-- Down Migration

ALTER TABLE jobs
    ADD COLUMN IF NOT EXISTS output_url JSONB;
