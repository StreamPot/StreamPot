-- Up Migration

CREATE TABLE IF NOT EXISTS assets
(
    id          SERIAL PRIMARY KEY,
    job_id      INTEGER      NOT NULL REFERENCES jobs (id) ON DELETE CASCADE,
    name        VARCHAR(255) NOT NULL,
    stored_path VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Down Migration

DROP TABLE IF EXISTS assets;
