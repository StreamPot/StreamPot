import pg from 'pg'

export let client: null | pg.Client = null;

export function connectToDB() {
    client = new pg.Client(process.env.PG_CONNECTION_STRING)
    client.connect()
}