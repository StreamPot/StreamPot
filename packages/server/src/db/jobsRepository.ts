import { Asset, JobEntity, JobEntityId, JobStatus, UnsavedJobEntity } from '../types'
import { OutputAsset, SavedAsset, SavedInputAsset, SavedOutputAsset } from '../types/asset';
import { JobMetadata } from '../types';
import getClient from "./db"

export async function addJob(data: UnsavedJobEntity): Promise<JobEntity> {
    const rows = await getClient().query(
        'INSERT INTO jobs (type, user_id, status, payload) VALUES ($1, $2, $3, $4::jsonb) RETURNING *',
        [data.type, data.user_id, data.status, JSON.stringify(data.payload)],
    )

    return rows.rows[0] as JobEntity
}

export async function setMetadata(metadata: JobMetadata) {
    await getClient().query(
        'INSERT INTO job_metadata (job_id, job_duration_ms, output_bytes, input_bytes) VALUES ($1, $2, $3, $4)',
        [metadata.job_id, metadata.job_duration_ms, metadata.input_bytes, metadata.output_bytes]
    );
    for (const asset of metadata.assets) {
        await getClient().query(
            'INSERT INTO asset_metadata (job_id, asset_id, size_bytes, type, name, ffprobe) VALUES ($1, $2, $3, $4, $5, $6)',
            [metadata.job_id, asset.id, asset.size, asset.type, asset.name, JSON.stringify(asset.ffprobe)]
        );
    }
}

export async function addAssets(job: JobEntity, assets: OutputAsset[]): Promise<SavedAsset[]> {
    const outputs: SavedOutputAsset[] = (await getClient().query(
        'INSERT INTO assets (job_id, name, stored_path, url, type) VALUES ' +
        assets.map((_, i) => `($1, $${2 + i * 3}, $${3 + i * 3}, $${4 + i * 3}, $${5 + i * 3})`).join(', ') +
        ' RETURNING *',
        [job.id, ...assets.flatMap(asset => [asset.name, asset.storedPath, asset.url, 'output'])]
    )).rows
    const inputs: SavedInputAsset[] = (await getClient().query(
        'INSERT INTO assets (job_id, url, type) VALUES ' +
        job.payload.filter(action => action.name === 'input').map((_, i) => `($1, $${2 + i * 2}, $${3 + i * 2})`).join(', ') +
        ' RETURNING *',
        [job.id, ...job.payload.filter(action => action.name === 'input').flatMap(action => [action.value[0], "input"])]
    )).rows
    return [...outputs, ...inputs]
}

export async function markJobComplete(id: JobEntityId, output: string) {
    return await getClient().query(
        'UPDATE jobs SET status = $1, completed_at = $2, logs = $3 WHERE id = $4',
        [JobStatus.Completed, new Date(), output, id]
    );
}

export async function markJobFailed(id: JobEntityId, output: string) {
    return await getClient().query(
        'UPDATE jobs SET status = $1, completed_at = $2, logs = $3 WHERE id = $4',
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
    const metadataRes = await client.query('SELECT * FROM job_metadata WHERE job_id = $1', [id]);
    const assetMetadataRes = await client.query('SELECT * FROM asset_metadata WHERE job_id = $1', [id]);

    return <JobEntity>{
        ...job,
        outputs: assetsToOutputs(assetsRes.rows),
        metadata: metadataRes.rows.length > 0 ? {
            ...metadataRes.rows[0],
            assets: assetMetadataRes.rows.map(row => ({
                ...row,
                ffprobe: typeof row.ffprobe === 'string' ? JSON.parse(row.ffprobe) : row.ffprobe
            }))
        } : null
    };
}

function assetsToOutputs(assets: OutputAsset[]): Record<string, string> {
    return assets.reduce((outputs, asset) => {
        outputs[asset.name] = asset.url
        return outputs
    }, {})
}

export async function getAllJobs(): Promise<JobEntity[]> {
    const client = getClient();
    const [
        jobs,
        assets
    ] = await Promise.all([
        client.query('SELECT * FROM jobs'),
        client.query('SELECT * FROM assets')
    ])

    return jobs.rows.map(job => <JobEntity>{
        ...job,
        outputs: assetsToOutputs(assets.rows.filter(asset => asset.job_id === job.id)),
    });
}
