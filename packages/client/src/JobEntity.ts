import { FFprobeResult } from "./ffprobe.type";

export type JobStatus = 'pending' | 'completed' | 'failed' | 'uploading';

type Outputs = Record<string, string>

type JobMetadata = {
    job_duration_ms: number
    input_bytes: number
    output_bytes: number
    assets: {
        name: string,
        type: 'input' | 'output',
        ffprobe: FFprobeResult
    }[]
}

export class JobEntity {
    public id: number
    public status: JobStatus
    public outputs: Outputs
    public logs?: string
    public metadata?: JobMetadata
    public created_at: string

    constructor(data: {
        id: number
        status: JobStatus
        outputs: Outputs
        logs?: string
        created_at: string
        metadata?: JobMetadata
    }) {
        this.id = data.id
        this.status = data.status
        this.outputs = data.outputs
        this.logs = data.logs
        this.created_at = data.created_at
        this.metadata = data.metadata
    }
}
