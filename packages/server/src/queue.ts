import Queue from "bull";
import fs, { promises as fsPromises } from 'node:fs';
import { JobStatus, QueueJob, type FfmpegActionsRequestType } from "./types";
import ffmpeg, { FfmpegCommand } from 'fluent-ffmpeg'
import { getJob, markJobComplete, updateJobStatus } from "./db/jobs";
import { getPublicUrl, uploadFile } from "./storage";

const videoQueue = new Queue("video transcoding", {
    redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT as string) || 6379,
        password: process.env.REDIS_PASSWORD,
    },
});

type FfmpegMethodName = keyof FfmpegCommand;

const allowedActions: FfmpegMethodName[] = [
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

function safeFfmpegCall(command: FfmpegCommand, methodName: keyof FfmpegCommand, values: any[]) {
    const method: Function | undefined = command[methodName];

    if (typeof method === 'function') {
        method.apply(command, values);
    } else {
        throw new Error(`Method ${String(methodName)} is not a function on FfmpegCommand.`);
    }
}

/**
 * Generate a random file name preserving the extension
 */
function randomizeFileName(fileName: string) {
    const extension = fileName.split('.').pop();

    if (!extension) {
        throw new Error('No extension found in file name');
    }

    const randomName = Math.random().toString(36).substring(7);

    return `${randomName}.${extension}`;
}

async function runActions(payload: FfmpegActionsRequestType, id: number) {
    const ffmpegCommand = ffmpeg();

    for (const action of payload) {
        const methodName = action.name as keyof FfmpegCommand;
        if (allowedActions.includes(methodName)) {
            safeFfmpegCall(ffmpegCommand, methodName, [...action.value]); // Wrap action.value in an array
        }
    }

    return new Promise((resolve, reject) => {
        ffmpegCommand.on('end', resolve)
        ffmpegCommand.on('error', reject)
        ffmpegCommand.run()
    })
}

function getNewTmpDir() {
    const dir = '/tmp/' + Math.random().toString(36).substring(7);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    return dir;
}

function makePayloadPathsSafe(basePath: string, payload: FfmpegActionsRequestType): {
    payload: FfmpegActionsRequestType,
    preservedPaths: Map<string, string>
} {
    const preservedPaths = new Map<string, string>();

    return {
        payload: payload.map((action) => {
            if (action.name !== 'output') {
                return action;
            }

            const safeFileName = `${basePath}/${randomizeFileName(action.value[0])}`;

            preservedPaths.set(action.value[0], safeFileName);

            return {
                name: action.name,
                value: [safeFileName]
            }
        }),
        preservedPaths: preservedPaths,
    }
}

videoQueue.process(Number(process.env.QUEUE_CONCURRENCY) || 1, async (job: { data: QueueJob }) => {
    try {
        const entity = await getJob(job.data.entityId)

        if (!entity) {
            console.log('job not found', job.data.entityId);
            return;
        }

        const baseDir = getNewTmpDir();

        const { payload, preservedPaths } = makePayloadPathsSafe(baseDir, entity.payload);
        await runActions(payload, job.data.entityId)

        await updateJobStatus(entity.id, JobStatus.Uploading)

        const uploads = await Promise.all([...preservedPaths]
            .map(async ([originalPath, safePath]) => {
                const remoteFileName = randomizeFileName(safePath.split('/').pop() as string)

                await uploadFile({
                    localFilePath: safePath,
                    remoteFileName: remoteFileName,
                });

                return {
                    path: originalPath,
                    public_url: await getPublicUrl(remoteFileName)
                }
            }));

        if (uploads.length === 0) {
            throw new Error('No files uploaded')
        }

        await markJobComplete(job.data.entityId, uploads)
        await fsPromises.rm(baseDir, { recursive: true });
    } catch (error: any) {
        console.error(error)
        await updateJobStatus(job.data.entityId, JobStatus.Failed)
    }
})

export { videoQueue }
