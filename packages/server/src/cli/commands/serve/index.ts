import { Command } from "commander";
import { serve } from "./serve";

export const createServeCommand = () => new Command("serve")
    .description("Start the server")
    .option("-p, --port <port>", "Port to listen on", "3000")
    .option("-h, --host <host>", "Host to listen on", "0.0.0.0")
    .action(serve)
