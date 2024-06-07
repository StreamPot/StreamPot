import StreamPot from "./StreamPot";

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

    readonly #client: StreamPot

    constructor(data: {
        id: number
        status: JobStatus
        assets?: Asset[]
        output?: string
        created_at: string
    }, client: StreamPot) {
        this.id = data.id
        this.status = data.status
        this.assets = data.assets
        this.output = data.output
        this.created_at = data.created_at
        this.#client = client
    }

    public async waitUntilFinished(intervalMs: number = 1000): Promise<JobEntity> {
        let job = await this.#client.getJob(this.id)

        while (job.status !== 'completed' && job.status !== 'failed') {
            await new Promise(resolve => setTimeout(resolve, intervalMs))
            job = await this.#client.getJob(this.id)
        }

        this.status = job.status
        this.assets = job.assets

        return this
    }
}
