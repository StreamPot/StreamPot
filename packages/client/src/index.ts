import fetch from 'node-fetch'

export class StreamPot {
    protected secret: string
    protected baseUrl: string

    protected actions: any[] = []

    constructor({ secret, baseUrl = 'http://localhost:3000' }) {
        this.secret = secret
        this.baseUrl = baseUrl
    }

    protected addAction(name: string, value: any) {
        this.actions.push({ name, value })
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

    input(url: string) {
        this.addAction('input', url)
        return this
    }

    setStartTime(seek: string | number) {
        if (seek) {
            this.addAction('setStartTime', seek)
        }
        return this
    }

    setDuration(seek: string | number) {
        if (seek) {
            this.addAction('setDuration', seek)
        }
        return this
    }

    async run() {
        console.log(this.actions);
        

        const response = await fetch(`${this.baseUrl}/`, {
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
