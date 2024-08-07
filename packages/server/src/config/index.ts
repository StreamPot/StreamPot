import TOML from "smol-toml"
import fs from "node:fs";
import { deepMerge } from "@/utils";
import type { Config } from "./types";
import type { DiskConfig } from "./types";

const DEFAULT_CONFIG: Partial<Config> = {
    queue: {
        concurrency: 5,
    },
    database: {
        connections: {
            pgsql: {
                url: "postgres://postgres:example@db:5432/example",
            },
            redis: {
                host: "localhost",
                port: 6379,
                password: "",
            },
        },
    },
};

function loadConfig(): Config {
    const fileConfig = TOML.parse(
        fs.readFileSync('config.toml', 'utf-8')
    ) as Partial<Config>;

    return deepMerge(DEFAULT_CONFIG, fileConfig) as Config;
}

export default loadConfig();

export type { DiskConfig }
