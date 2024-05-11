#!/usr/bin/env node
import { Command, OptionValues } from "commander";
import * as packageJson from "../package.json";
import server from "./server";
import pgMigrate from 'node-pg-migrate'
import { config } from "dotenv";
import * as path from "node:path";

const migrationsConfig = {
    databaseUrl: process.env.DATABASE_URL,
    dir: path.join(__dirname, '../migrations'),
    migrationsTable: 'migrations',
    verbose: true,
}

const program = new Command()

program
    .name("streampot")
    .version(packageJson.version)
    .description("CLI for the StreamPot server")
    .option("-e, --env <env>", "Environment file", ".env")
    .hook('preSubcommand', (thisCommand) => {
        config({ path: thisCommand.opts().env });
    })

program.command("serve")
    .description("Start the server")
    .option("-p, --port <port>", "Port to listen on", "3000")
    .option("-h, --host <host>", "Host to listen on", "0.0.0.0")
    .action(async (options: OptionValues) => {
        process.stdout.write(`Starting StreamPot server on http://${options.host}:${options.port}\n`);

        await server.listen({
            port: parseInt(options.port),
            host: options.host,
        });
    });

program.command("migrate")
    .description("Run migrations")
    .action(async () => {
        process.stdout.write(`Running migrations...\n`);

        await pgMigrate({ ...migrationsConfig, direction: 'up' })

        process.exit(0);
    });

program.command('migrate:down')
    .description('Rollback migrations')
    .action(async () => {
        process.stdout.write(`Rolling back migrations...\n`);

        await pgMigrate({ ...migrationsConfig, direction: 'down' })

        process.exit(0);
    });

program.parse();
