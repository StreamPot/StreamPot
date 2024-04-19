import fetch from 'node-fetch'

export class StreamPot {
    protected secret: string
    protected baseUrl: string

    protected actions: any[] = []

    constructor({ secret, baseUrl = 'http://localhost:3000' }) {
        this.secret = secret
        this.baseUrl = baseUrl
    }

    protected addAction(action: string, value: any) {
        this.actions.push({ action, value })
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
    setStartTime(seek: string | number) {
        if (seek) {
            this.addAction('setStartTime', seek)
        }
        return this
    }
    setEndTime(seek: string | number) {
        if (seek) {
            this.addAction('setEndTime', seek)
        }
        return this
    }

    async run() {
        const response = await fetch(`${this.baseUrl} /`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.secret}`
            },
            body: JSON.stringify(this.actions)
        })

        return response.json()
    }
}