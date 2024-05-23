import fluentFfmpeg from 'fluent-ffmpeg'

export type Workflow = WorkflowAction[]

/**
 * Uses fluent-ffmpeg to build the ffmpeg command string from a workflow.
 */
export function toCommand(workflow: Workflow): string {
    const ffmpegInstance = fluentFfmpeg()

    for (const action of workflow) {
        if ((methods as string[]).includes(action.name)) {
            ffmpegInstance[action.name](...action.value)
        }
    }

    return ffmpegInstance._getArguments().join(' ')
}

interface WorkflowAction {
    name: string,
    value: string[]
}

/**
 * A list of methods that are allowed to be called on the ffmpeg instance.
 */
const methods: (keyof FfmpegComman)[] = [
    'mergeAdd',
    'addInput',
    'input',
    'withInputFormat',
    'inputFormat',
    'fromFormat',
    'withInputFps',
    'withInputFPS',
    'withFpsInput',
    'withFPSInput',
    'inputFPS',
    'inputFps',
    'fpsInput',
    'FPSInput',
    'nativeFramerate',
    'withNativeFramerate',
    'native',
    'setStartTime',
    'seekInput',
    'loop',
    'withNoAudio',
    'noAudio',
    'withAudioCodec',
    'audioCodec',
    'withAudioBitrate',
    'audioBitrate',
    'withAudioChannels',
    'audioChannels',
    'withAudioFrequency',
    'audioFrequency',
    'withAudioQuality',
    'audioQuality',
    'withAudioFilter',
    'withAudioFilters',
    'audioFilter',
    'audioFilters',
    'withNoVideo',
    'noVideo',
    'withVideoCodec',
    'videoCodec',
    'withVideoBitrate',
    'videoBitrate',
    'withVideoFilter',
    'withVideoFilters',
    'videoFilter',
    'videoFilters',
    'withOutputFps',
    'withOutputFPS',
    'withFpsOutput',
    'withFPSOutput',
    'withFps',
    'withFPS',
    'outputFPS',
    'outputFps',
    'fpsOutput',
    'FPSOutput',
    'fps',
    'FPS',
    'takeFrames',
    'withFrames',
    'frames',
    'keepPixelAspect',
    'keepDisplayAspect',
    'keepDisplayAspectRatio',
    'keepDAR',
    'withSize',
    'setSize',
    'size',
    'withAspect',
    'withAspectRatio',
    'setAspect',
    'setAspectRatio',
    'aspect',
    'aspectRatio',
    'applyAutopadding',
    'applyAutoPadding',
    'applyAutopad',
    'applyAutoPad',
    'withAutopadding',
    'withAutoPadding',
    'withAutopad',
    'withAutoPad',
    'autoPad',
    'autopad',
    'addOutput',
    'output',
    'seekOutput',
    'seek',
    'withDuration',
    'setDuration',
    'duration',
    'toFormat',
    'withOutputFormat',
    'outputFormat',
    'format',
    'map',
    'updateFlvMetadata',
    'flvmeta',
    'addInputOption',
    'withInputOption',
    'inputOption',
    'addOutputOption',
    'addOption',
    'withOutputOption',
    'withOption',
    'outputOption',
    'filterGraph',
    'complexFilter',
];
