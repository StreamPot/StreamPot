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
    pgm.createTable('metadata',{
        id: {
            type: 'serial',
            primaryKey: true,
        },
        job_id:{
            type:'integer',
            references: 'jobs(id)',
            onDelete: 'CASCADE',
            notNull: true,
        },
        asset_id:{
            type:'integer',
            references: 'assets(id)',
            onDelete: 'CASCADE',
            notNull: false,
        },
        type:{
            type: 'varchar(255)',
            notNull: true
        },
        ffprobe_json: {
            type: 'jsonb',
            notNull: false,
        },
        size: {
            type: 'integer',
            notNull: false,
        },
        created_at: {
            type: 'timestamp',
            default: pgm.func('CURRENT_TIMESTAMP')
        },
    })


};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('metadata', {
        ifExists: true
    });
};
