import { JobEntity, JobEntityId } from '../types'
import { OutputAsset, SavedAsset, SavedInputAsset, SavedOutputAsset } from '../types/asset';
import getClient from "./db"

export async function addAssets(job: JobEntity, assets: OutputAsset[]): Promise<SavedAsset[]> {
    const client = getClient()

    let outputs: SavedOutputAsset[] = []
    if (assets.length > 0) {
        const sql = `
        INSERT INTO assets (job_id, name, stored_path, url, type)
        VALUES ${assets.map((_, i) => `($1, $${2 + i * 4}, $${3 + i * 4}, $${4 + i * 4}, $${5 + i * 4})`).join(', ')}
        RETURNING *
      `
        const params = [
            job.id,
            ...assets.flatMap(a => [a.name, a.storedPath, a.url, 'output']),
        ]
        outputs = (await client.query(sql, params)).rows
    }

    const inputActions = job.payload.filter(a => a.name === 'input')
    let inputs: SavedInputAsset[] = []
    if (inputActions.length > 0) {
        const sql = `
        INSERT INTO assets (job_id, url, type)
        VALUES ${inputActions.map((_, i) => `($1, $${2 + i * 2}, $${3 + i * 2})`).join(', ')}
        RETURNING *
      `
        const params = [
            job.id,
            ...inputActions.flatMap(action => [action.value[0], 'input']),
        ]
        inputs = (await client.query(sql, params)).rows
    }

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