import { JobEntityId } from "../types"

export class JobNotFoundError extends Error {
    constructor(id: JobEntityId) {
        super(`Job ${id} not found`)
        this.name = 'JobNotFoundError'
    }
}

export class NoOutputsError extends Error {
    constructor(id: JobEntityId) {
        super(`No outputs to delete for job ${id}`)
        this.name = 'NoOutputsError'
    }
}

export class DeletionError extends Error {
    constructor(public key: string, cause: Error) {
        super(`Failed to delete ${key}: ${cause.message}`)
    }
}