import { JobMetadata } from '../types';
import getClient from "./db"

export async function setMetadata(metadata: JobMetadata) {
    await getClient().query(
        'INSERT INTO job_metadata (job_id, job_duration_ms, output_bytes, input_bytes) VALUES ($1, $2, $3, $4)',
        [metadata.job_id, metadata.job_duration_ms, metadata.output_bytes, metadata.input_bytes]
    );
    for (const asset of metadata.assets) {
        await getClient().query(
            'INSERT INTO asset_metadata (job_id, asset_id, size_bytes, type, name, ffprobe) VALUES ($1, $2, $3, $4, $5, $6)',
            [metadata.job_id, asset.id, asset.size, asset.type, asset.name, JSON.stringify(asset.ffprobe)]
        );
    }
}