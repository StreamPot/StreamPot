import pg, { Client } from 'pg'

let client: pg.Client | null = null

export default function getClient(): Client {
    if (client) return client

    client = new pg.Client(process.env.PG_CONNECTION_STRING)
    client.connect()

    return client
}