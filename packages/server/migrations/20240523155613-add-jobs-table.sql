-- Up Migration

CREATE TABLE IF NOT EXISTS jobs
(
    id           SERIAL PRIMARY KEY,
    type         VARCHAR(255) NOT NULL,
    user_id      VARCHAR(255) NOT NULL,
    status       TEXT         NOT NULL,
    output_url   JSONB,
    payload      JSONB,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Down Migration

DROP TABLE IF EXISTS jobs;
