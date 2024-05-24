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
    pgm.createTable('assets', {
        id: {
            type: 'serial',
            primaryKey: true
        },
        job_id: {
            type: 'integer',
            notNull: true,
            references: 'jobs(id)',
            onDelete: 'CASCADE'
        },
        name: {
            type: 'varchar(255)',
            notNull: true
        },
        stored_path: {
            type: 'varchar(255)',
            notNull: true
        },
        url: {
            type: 'varchar(255)',
            notNull: true
        },
        created_at: {
            type: 'timestamp',
            default: pgm.func('CURRENT_TIMESTAMP')
        }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('assets', {
        ifExists: true
    });
};
