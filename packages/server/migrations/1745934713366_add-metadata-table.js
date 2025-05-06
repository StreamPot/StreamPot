/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('job_metadata', {
        id: {
            type: 'serial',
            primaryKey: true
        },
        input_bytes: {
            type: 'bigint',
            default: 0
        },
        output_bytes: {
            type: 'bigint',
            default: 0
        },
        job_id: {
            type: 'integer',
            notNull: true,
            references: "jobs(id)",
            onDelete: 'CASCADE',
            unique: true
        },
        job_duration_ms: {
            type: 'integer',
            notNull: true,
            default: 0
        }
    });

    pgm.createTable('asset_metadata', {
        id: {
            type: 'serial',
            primaryKey: true
        },
        job_id: {
            type: 'integer',
            notNull: true,
            references: "jobs(id)",
            onDelete: 'CASCADE'
        },
        asset_id: {
            type: 'integer',
            references: "assets(id)",
            onDelete: 'SET NULL'
        },
        size_bytes: {
            type: 'bigint',
            notNull: true,
            default: 0
        },
        name: {
            type: 'text',
            notNull: false
        },
        type: {
            type: 'text',
            notNull: true,
            check: "type IN ('input', 'output')"
        },
        ffprobe: {
            type: 'jsonb',
            notNull: true
        }
    });

    pgm.createIndex('asset_metadata', ['job_id', 'type']);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropIndex('asset_metadata', ['job_id', 'type']);
    pgm.dropTable('asset_metadata');
    pgm.dropTable('job_metadata');
};
