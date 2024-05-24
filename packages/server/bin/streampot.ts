#!/usr/bin/env node
import baseCommand from "../src/cli"
import * as packageJson from "../package.json";

baseCommand
    .version(packageJson.version)
    .parse()
