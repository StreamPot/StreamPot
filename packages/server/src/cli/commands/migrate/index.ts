import { migrate } from "./migrate";
import { Command } from "commander";

export const createMigrateCommand = () => new Command("migrate")
    .description("Run migrations")
    .action(migrate);
