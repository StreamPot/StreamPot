import pg, { Client } from 'pg'
import config from "../config";

let client: pg.Client | null = null

export default function getClient(): Client {
    if (client) return client

    client = new pg.Client(config.database.connections.pgsql.url)
    client.connect()

    return client
}
