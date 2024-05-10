#!/usr/bin/env node
import { program, OptionValues } from "commander";
import * as packageJson from "../package.json";

program
    .name("streampot")
    .version(packageJson.version)
    .description("CLI for the StreamPot server");

program.command("serve")
    .description("Start the server")
    .option("-p, --port <port>", "Port to listen on", "3000")
    .option("-h, --host <host>", "Host to listen on", "localhost")
    .action((options: OptionValues) => {
        console.log("Starting the server..." + options.port);
        console.log("Starting the server...");
    });

program.command("migrate")
    .description("Run migrations")
    .action(() => {
        console.log("Running migrations...");
    });

program.parse();
