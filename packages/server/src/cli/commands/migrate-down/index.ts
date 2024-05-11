import { migrateDown } from "./migrate-down";
import { Command } from "commander";

export const createMigrateDownCommand = () => new Command("migrate-down")
    .description('Rollback migrations')
    .action(migrateDown);
