export function shouldCollectAssetMetadata() {
    return process.env.COLLECT_ASSET_METADATA === 'true'
}

export function shouldUseDockerForFFmpeg() {
    return process.env.FFMPEG_STRATEGY === 'docker'
}

export function shouldUseAPIKey() {
    return process.env.API_KEY !== undefined && process.env.API_KEY !== ""
}