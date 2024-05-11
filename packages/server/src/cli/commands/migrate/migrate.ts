import pgMigrate from "node-pg-migrate";
import migrationsConfig from "../../migrationsConfig";

export const migrate = async () => {
    process.stdout.write(`Running migrations...\n`);

    await pgMigrate({ ...migrationsConfig, direction: 'up' })

    process.exit(0);
}
