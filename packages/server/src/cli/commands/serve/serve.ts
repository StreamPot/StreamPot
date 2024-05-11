import { OptionValues } from "commander";
import server from "../../../server";

export const serve = async (options: OptionValues) => {
    process.stdout.write(`Starting StreamPot server on http://${options.host}:${options.port}\n`);

    await server.listen({
        port: parseInt(options.port),
        host: options.host,
    });
}
