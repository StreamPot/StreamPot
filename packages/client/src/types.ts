type JobStatus = 'pending' | 'completed' | 'failed' | 'uploading'

type Upload = {
    key: string
    publicUrl: string
}

export type JobEntity = {
    id: number
    status: JobStatus
    output_url?: Upload[]
    created_at: string
}

export type StreamPotOptions = {
    secret: string;
    baseUrl?: string;
}
