import pgMigrate from "node-pg-migrate";
import migrationsConfig from "../../migrationsConfig";

export const migrateDown = async () => {
    process.stdout.write(`Rolling back migrations...\n`);

    await pgMigrate({ ...migrationsConfig, direction: 'down' })

    process.exit(0);
}
