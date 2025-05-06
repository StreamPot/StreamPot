import { FFprobeResult } from "./"

interface BaseAsset {
    url: string
}

export interface InputAsset extends BaseAsset {
    type: 'input'
}
export interface OutputAsset extends BaseAsset {
    type: 'output'
    name: string
    storedPath: string
}

export type Asset = InputAsset | OutputAsset

export interface SavedInputAsset extends InputAsset {
    id: number
    job_id: number
    created_at: string
}

export interface SavedOutputAsset extends OutputAsset {
    id: number
    job_id: number
    created_at: string
}

export type SavedAsset = SavedInputAsset | SavedOutputAsset
