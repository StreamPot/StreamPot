import pg, { Client } from 'pg'

let client: pg.Client | null = null

export default function getClient(): Client {
    if (client) return client

    client = new pg.Client(process.env.DATABASE_URL)
    client.connect()

    return client
}