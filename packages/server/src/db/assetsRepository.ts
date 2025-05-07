import { JobEntity, JobEntityId } from '../types'
import { OutputAsset, SavedAsset, SavedInputAsset, SavedOutputAsset } from '../types/asset';
import getClient from "./db"

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

export async function getAssetsByJobId(id: JobEntityId): Promise<SavedOutputAsset[]> {
    return (await getClient().query(
        'SELECT * FROM assets WHERE job_id = $1 AND type = $2 AND deleted_at IS NULL',
        [id, 'output'])
    ).rows
}

export async function markAssetAsDeleted(assetId: number): Promise<SavedOutputAsset> {
    return (await getClient().query(
        'UPDATE assets SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
        [assetId]
    )).rows[0];
}