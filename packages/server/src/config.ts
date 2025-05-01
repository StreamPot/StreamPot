export function shouldCollectAssetMetadata() {
    console.log("process.env.COLLECT_ASSET_METADATA")
    console.log(process.env.COLLECT_ASSET_METADATA)
    console.log(process.env.COLLECT_ASSET_METADATA === 'true')
    return process.env.COLLECT_ASSET_METADATA === 'true'
}

export function shouldUseDockerForFFmpeg() {
    console.log("process.env.FFMPEG_STRATEGY")
    console.log(process.env.FFMPEG_STRATEGY)
    console.log(process.env.FFMPEG_STRATEGY === 'docker')
    return process.env.FFMPEG_STRATEGY === 'docker'
}

export function shouldUseAPIKey() {
    console.log("process.env.API_KEY")
    console.log(process.env.API_KEY)
    console.log(process.env.API_KEY !== undefined && process.env.API_KEY !== "")
    return process.env.API_KEY !== undefined && process.env.API_KEY !== ""
}