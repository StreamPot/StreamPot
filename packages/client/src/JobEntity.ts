export type JobStatus = 'pending' | 'completed' | 'failed' | 'uploading';

type Outputs = Record<string, string>

export class JobEntity {
    public id: number
    public status: JobStatus
    public outputs: Outputs
    public logs?: string
    public created_at: string

    constructor(data: {
        id: number
        status: JobStatus
        outputs: Outputs
        logs?: string
        created_at: string
    }) {
        this.id = data.id
        this.status = data.status
        this.outputs = data.outputs
        this.logs = data.logs
        this.created_at = data.created_at
    }
}
