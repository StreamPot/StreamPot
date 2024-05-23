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
    pgm.createTable('jobs', {
        id: {
            type: 'serial',
            primaryKey: true
        },
        type: {
            type: 'varchar(255)',
            notNull: true
        },
        user_id: {
            type: 'varchar(255)',
            notNull: true
        },
        status: {
            type: 'text',
            notNull: true
        },
        output_url: 'jsonb',
        payload: 'jsonb',
        created_at: {
            type: 'timestamp',
            default: pgm.func('CURRENT_TIMESTAMP')
        },
        completed_at: 'timestamp'
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('jobs', {
        ifExists: true
    });
};
