import { Asset, JobEntity, JobEntityId, JobStatus, UnsavedJobEntity } from '../types'
import getClient from "./db"

export async function addJob(data: UnsavedJobEntity): Promise<JobEntity> {
    const rows = await getClient().query(
        'INSERT INTO jobs (type, user_id, status, payload) VALUES ($1, $2, $3, $4::jsonb) RETURNING *',
        [data.type, data.user_id, data.status, JSON.stringify(data.payload)],
    )

    return rows.rows[0] as JobEntity
}

export async function markJobComplete(id: JobEntityId, assets: Asset[], output: string) {
    if (assets.length !== 0) {
        await getClient().query(
            'INSERT INTO assets (job_id, name, stored_path) VALUES ' +
            assets.map((_, i) => `($1, $${2 + i * 2}, $${3 + i * 2})`).join(', '),
            [id, ...assets.flatMap(asset => [asset.name, asset.storedPath])]
        );
    }

    return await getClient().query(
        'UPDATE jobs SET status = $1, completed_at = $2, output = $3 WHERE id = $4',
        [JobStatus.Completed, new Date(), output, id]
    );
}

export async function markJobFailed(id: JobEntityId, output: string) {
    return await getClient().query(
        'UPDATE jobs SET status = $1, completed_at = $2, output = $3 WHERE id = $4',
        [JobStatus.Failed, new Date(), output, id]
    );
}

export function updateJobStatus(id: JobEntityId, status: JobStatus) {
    return getClient().query(
        'UPDATE jobs SET status = $1 WHERE id = $2',
        [status, id]
    );
}

export async function getJobWithAssets(id: JobEntityId): Promise<JobEntity | null> {
    const client = getClient();

    const jobRes = await client.query('SELECT * FROM jobs WHERE id = $1 LIMIT 1', [id]);
    if (jobRes.rows.length === 0) return null;

    const job = jobRes.rows[0];
    const assetsRes = await client.query('SELECT * FROM assets WHERE job_id = $1', [id]);

    job.assets = assetsRes.rows;
    return <JobEntity>job;
}

export async function getAllJobs(): Promise<JobEntity[]> {
    return (await getClient().query('SELECT * FROM jobs')).rows as JobEntity[]
}
