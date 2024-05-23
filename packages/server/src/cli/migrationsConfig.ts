import * as path from "node:path";

export default {
    databaseUrl: process.env.DATABASE_URL,
    dir: path.join(__dirname, '/../../migrations'),
    migrationsTable: 'migrations',
    verbose: true,
}
