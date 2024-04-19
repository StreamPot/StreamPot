import { JobEntity, JobEntityId, JobStatus, UnsavedJobEntity } from '../types'
import getClient from "./db"

export async function addJob(data: UnsavedJobEntity): Promise<JobEntity> {
    const rows = await getClient().query(
        'INSERT INTO jobs (type, user_id, status, source_url, output_url, payload) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [data.type, data.user_id, data.status, data.output_url, data.payload],
    )

    return rows.rows[0] as JobEntity
}

export async function markJobComplete(id: JobEntityId, outputUrl: string) {
    const completedAt = new Date();
    const res = await getClient().query(
        'UPDATE jobs SET status = $1, completed_at = $2, output_url = $3 WHERE id = $4',
        [JobStatus.Completed, completedAt, outputUrl, id]
    );
    return res;
}

export function updateJobStatus(id: JobEntityId, status: JobStatus) {
    return getClient().query(
        'UPDATE jobs SET status = $1 WHERE id = $2',
        [status, id]
    );
}

export async function getJob(id: JobEntityId): Promise<JobEntity | null> {
    const res = await getClient().query('SELECT * FROM jobs WHERE id = $1 LIMIT 1', [id])
    return <JobEntity>res.rows[0] ?? null
}

export async function getAllJobs(): Promise<JobEntity[]> {
    return (await getClient().query('SELECT * FROM jobs')).rows as JobEntity[]
}
