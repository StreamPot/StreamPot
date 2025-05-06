import { executeFFProbe } from "./ffmpeg/ffprobe";
import { JobEntity, SavedAsset, JobEntityId, JobMetadata } from "./types";
import * as jobsRepository from './db/jobsRepository';

export async function generateMetadata(job: JobEntity, assetsWithIds: SavedAsset[], startTime: number) {
    const metadata = await getMetadata(job.id, assetsWithIds, startTime);
    await jobsRepository.setMetadata(metadata);
}

export async function getMetadata(jobId: JobEntityId, assets: SavedAsset[], startTime: number): Promise<JobMetadata> {
    const metadata: JobMetadata = {
        job_id: jobId,
        job_duration_ms: 0,
        input_bytes: 0,
        output_bytes: 0,
        assets: []
    };

    const assetPromises = assets.map(async (asset) => {
        const ffprobeResult = await executeFFProbe(asset.url);
        const sizeBytes = Number(ffprobeResult.format?.size || 0);

        if (asset.type === 'input') {
            metadata.input_bytes += sizeBytes;
            metadata.assets.push({
                id: asset.id,
                name: null,
                type: asset.type,
                size: sizeBytes,
                ffprobe: ffprobeResult
            });
        } else {
            metadata.output_bytes += sizeBytes;
            metadata.assets.push({
                id: asset.id,
                name: asset.name,
                type: asset.type,
                size: sizeBytes,
                ffprobe: ffprobeResult
            });
        }

    });

    await Promise.all(assetPromises);

    metadata.job_duration_ms = Date.now() - startTime;
    return metadata;
}