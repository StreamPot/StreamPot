import fetch from 'node-fetch'

export class StreamPot {
    protected secret: string
    protected baseUrl: string

    protected inputUrl: string

    protected start: number
    protected end: number

    constructor({ secret, baseUrl = 'http://localhost:3000' }) {
        this.secret = secret
        this.baseUrl = baseUrl
    }

    input(url: string) {
        this.inputUrl = url
        return this
    }

    startAt(seconds: number) {
        this.start = seconds
        return this
    }

    endAt(seconds: number) {
        this.end = seconds
        return this
    }

    async checkStatus(jobId: string) {
        try {
            const res = await fetch(`${this.baseUrl}/jobs/${jobId}`)
            const data = await res.json()
            return data
        } catch (error) {
            console.error(error)
        }
    }

    async run() {
        if (!this.inputUrl) {
            throw new Error('Input URL is required')
        }

        if (!this.start) {
            throw new Error('Start time is required')
        }

        if (!this.end) {
            throw new Error('End time is required')
        }

        const response = await fetch(`${this.baseUrl} /clip`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.secret}`
            },
            body: JSON.stringify({
                source_url: this.inputUrl,
                start_ms: this.start * 1000,
                end_ms: this.end * 1000,
            })
        })

        return response.json()
    }
}