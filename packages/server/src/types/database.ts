import { ExtractAudioType, VideoTrimType } from "../types";

export type JobEntityId = number

export enum JobStatus {
    Pending = 'pending',
    Completed = 'completed',
    Failed = 'failed',
    Uploading = 'uploading'
}

export enum Transformation {
    Trim = 'trim',
    ExtractAudio = 'extract-audio'
}

type PayloadFields =
    | { type: Transformation.Trim, payload: VideoTrimType }
    | { type: Transformation.ExtractAudio, payload: ExtractAudioType };

export type UnsavedJobEntity = PayloadFields & {
    user_id: string,
    status: JobStatus,
    source_url: string,
    output_url?: string,
}

export type JobEntity = UnsavedJobEntity & {
    id: JobEntityId,
    created_at: Date,
    completed_at?: Date
}
