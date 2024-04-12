import { client } from "./db"

export async function addJob(id: string, userId: string) {
    try {
        if (!client) {
            throw new Error('DB not connected')
        }
        const res = await client.query('INSERT INTO jobs (id, user_id, status) VALUES ($1, $2, $3)', [id, userId, 'pending'])
        return res
    }
    catch (err: any) {
        console.log(err)
        return null
    }
}

export async function markJobComplete(id: string, outputUrl: string) {
    try {
        console.log('marking job complete ', id);
        if (!client) {
            throw new Error('DB not connected');
        }
        const completedAt = new Date();
        const res = await client.query(
            'UPDATE jobs SET status = $1, completed_at = $2, output_url = $3 WHERE id = $4',
            ['completed', completedAt, outputUrl, id]
        );
        return res;
    } catch (err: any) {
        console.log(err);
        return null;
    }
}
export function markJobFailed(id: string) {
    try {
        if (!client) {
            throw new Error('DB not connected');
        }
        const completedAt = new Date();
        const res = client.query(
            'UPDATE jobs SET status = $1, completed_at = $2 WHERE id = $3',
            ['failed', completedAt, id]
        );
        return res;
    } catch (err: any) {
        console.log(err);
        return null;
    }
}

export async function getJob(id: string) {
    try {
        if (!client) {
            throw new Error('DB not connected')
        }
        const res = await client.query('SELECT * FROM jobs WHERE id = $1', [id])
        if (res.rows.length === 0) return null
        return res.rows[0]
    }
    catch (err: any) {
        console.log(err)
        return null
    }
}