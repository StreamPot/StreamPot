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
    pgm.sql(`ALTER TABLE assets ALTER COLUMN name DROP NOT NULL;`);
    pgm.sql(`ALTER TABLE assets ALTER COLUMN stored_path DROP NOT NULL;`);
    pgm.sql(`ALTER TABLE assets ADD COLUMN type VARCHAR(50) NOT NULL DEFAULT 'output';`);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.sql(`UPDATE assets SET name = 'input_asset' WHERE name IS NULL;`);
    pgm.sql(`UPDATE assets SET stored_path = 'input_asset' WHERE stored_path IS NULL;`);

    pgm.sql(`ALTER TABLE assets ALTER COLUMN name SET NOT NULL;`);
    pgm.sql(`ALTER TABLE assets ALTER COLUMN stored_path SET NOT NULL;`);


    pgm.sql(`ALTER TABLE assets DROP COLUMN type;`);
};
