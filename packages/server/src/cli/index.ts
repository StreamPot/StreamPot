#!/usr/bin/env node
import { Command } from "commander";
import * as packageJson from "../../package.json";
import { config } from "dotenv";
import { createServeCommand } from "./commands/serve";
import { createMigrateDownCommand } from "./commands/migrate-down";
import { createMigrateCommand } from "./commands/migrate";

new Command()
    .name("streampot")
    .version(packageJson.version)
    .description("CLI for the StreamPot server")
    .option("-e, --env <env>", "Environment file", ".env")
    .hook('preSubcommand', (thisCommand) => {
        config({ path: thisCommand.opts().env });
        ensureEnvVariablesExist(['DATABASE_URL', 'S3_ACCESS_KEY', 'S3_SECRET_KEY', 'S3_ENDPOINT', 'S3_BUCKET_NAME']);
    })
    .addCommand(createServeCommand())
    .addCommand(createMigrateDownCommand())
    .addCommand(createMigrateCommand())
    .parse();

function ensureEnvVariablesExist(names: string[]) {
    names.forEach(name => {
        if (!process.env[name]) {
            throw new Error(`Missing required environment variable ${name}`);
        }
    });
}
