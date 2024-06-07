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
            'INSERT INTO assets (job_id, name, stored_path, url) VALUES ' +
            assets.map((_, i) => `($1, $${2 + i * 3}, $${3 + i * 3}, $${4 + i * 3})`).join(', '),
            [id, ...assets.flatMap(asset => [asset.name, asset.storedPath, asset.url])]
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
    const assetsRes = await client.query('SELECT name, url FROM assets WHERE job_id = $1', [id]);

    return <JobEntity>{
        ...job,
        outputs: assetsToOutputs(assetsRes.rows),
    };
}

function assetsToOutputs(assets: Asset[]) {
    return assets.reduce((outputs, asset) => {
        outputs[asset.name] = asset.url
        return outputs
    }, {})
}

export async function getAllJobs(): Promise<JobEntity[]> {
    const getAllJobsAndTheirAssets = `
    SELECT 
        jobs.*, 
        json_agg(json_build_object('name', assets.name, 'url', assets.url)) AS assets
    FROM 
        jobs
    LEFT JOIN 
        assets ON jobs.id = assets.job_id
    GROUP BY 
        jobs.id
`;
    const rows = (await getClient().query(getAllJobsAndTheirAssets)).rows
    const jobs = rows.map(job => {
        const { assets, ...jobsWithoutAssets } = job
        return { ...jobsWithoutAssets, outputs: assetsToOutputs(assets) }
    })
    return jobs
}
