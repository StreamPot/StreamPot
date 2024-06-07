export type JobStatus = 'pending' | 'completed' | 'failed' | 'uploading';

type Asset = {
    name: string
    url: string
}

export class JobEntity {
    public id: number
    public status: JobStatus
    public assets?: Asset[]
    public output?: string
    public created_at: string

    constructor(data: {
        id: number
        status: JobStatus
        assets?: Asset[]
        output?: string
        created_at: string
    }) {
        this.id = data.id
        this.status = data.status
        this.assets = data.assets
        this.output = data.output
        this.created_at = data.created_at
    }
}
