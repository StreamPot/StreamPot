import type { Options } from "tsup";

const env = process.env.NODE_ENV;

export const tsup: Options = {
    splitting: true,
    sourcemap: env === "development",
    clean: true,
    dts: true,
    format: ["cjs", "esm"],
    minify: false,
    bundle: true,
    skipNodeModulesBundle: true,
    entry: [
        "bin/streampot.ts",
        "src/index.ts",
    ],
    watch: env === "development" ? ['src'] : undefined,
    target: "node20",
    treeshake: true,
};
