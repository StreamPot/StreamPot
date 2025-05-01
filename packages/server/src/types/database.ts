import { FFprobeResult, FfmpegActionsRequestType } from "./";

export type JobEntityId = number

export enum JobStatus {
    Pending = 'pending',
    Completed = 'completed',
    Failed = 'failed',
    Uploading = 'uploading',
    GeneratingMetadata = 'generating_metadata'
}

export enum Transformation {
    Actions = 'action'
}

type PayloadFields =
    | { type: Transformation.Actions, payload: FfmpegActionsRequestType }

export type UnsavedJobEntity = PayloadFields & {
    user_id: string,
    status: JobStatus,
    output_url?: string,
}

export type JobEntity = UnsavedJobEntity & {
    id: JobEntityId,
    created_at: Date,
    completed_at?: Date
    outputs?: Record<string, string> // record of assets name (user provided) and url (generated)
}

export type JobMetadata = {
    job_id: number
    job_duration_ms: number
    input_bytes: number
    output_bytes: number
    assets: {
        id: number | null,
        name: string,
        type: 'input' | 'output',
        ffprobe: FFprobeResult
    }[]
}