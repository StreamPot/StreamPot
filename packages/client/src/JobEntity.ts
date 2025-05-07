import { FFprobeResult } from "./ffprobe.type";

export type JobStatus = 'pending' | 'completed' | 'failed' | 'uploading';

type Outputs = Record<string, string>

type JobMetadata = {
    job_duration_ms: number
    input_bytes: number
    job_id: number
    output_bytes: number
    assets: {
        id: number
        job_id: number
        name: string | null
        size_bytes: number
        type: 'input' | 'output'
        deleted_at: string | null
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
