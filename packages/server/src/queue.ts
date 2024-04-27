import Queue from "bull";
import fs, { promises as fsPromises } from 'fs';
import { JobStatus, QueueJob, type FfmpegActionsRequestType } from "./types";
import ffmpeg, { FfmpegCommand } from 'fluent-ffmpeg'
import { getJob, markJobComplete, updateJobStatus } from "./db/jobs";
import { getPublicUrl, uploadFile } from "./storage";

const videoQueue = new Queue("video transcoding", {
    redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT as string),
        password: process.env.REDIS_PASSWORD,
    },
});

type FfmpegMethodName = keyof FfmpegCommand;

const allowedActions: FfmpegMethodName[] = [
    'input',
    'inputFormat',
    'output',
    'outputFormat',
    'setStartTime',
    'setDuration',
    'output',
    'outputFormat',
    'videoCodec',
    'audioCodec',
    'format',
    'noAudio',
    'noVideo',
    'audioBitrate',
    'videoBitrate',
    'size',
    'fps',
    'outputOptions',
    'audioFilters',
    'videoFilters',
    'audioChannels',
    'audioFrequency',
    'complexFilter'
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
function randomifyFileName(fileName: string) {
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
            safeFfmpegCall(ffmpegCommand, methodName, [action.value]); // Wrap action.value in an array
        }
    }

    return new Promise((resolve, reject) => {
        ffmpegCommand.on('end', resolve)
        ffmpegCommand.on('error', reject)
        ffmpegCommand
            .run()
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

            const safeFileName = `${basePath}/${randomifyFileName(action.value)}`;

            preservedPaths.set(action.value, safeFileName);

            return {
                name: action.name,
                value: safeFileName
            }
        }),
        preservedPaths: preservedPaths,
    }
}

videoQueue.process(async (job: { data: QueueJob }) => {
    try {
        const entity = await getJob(job.data.entityId)

        if (!entity) {
            console.log('job not found', job.data.entityId);
            return;
        }

        const baseDir = getNewTmpDir();

        const { payload, preservedPaths } = makePayloadPathsSafe(baseDir, entity.payload);
        await runActions(payload, job.data.entityId)

        updateJobStatus(entity.id, JobStatus.Uploading)

        const uploads = await Promise.all([...preservedPaths].map(async ([originalPath, safePath]) => {
            const remoteFileName = randomifyFileName(safePath.split('/').pop() as string)

            const upload: any = await uploadFile({
                localFilePath: safePath,
                remoteFileName: remoteFileName,
            })

            return {
                ...upload,
                path: originalPath,
                publicUrl: await getPublicUrl(remoteFileName)
            }
        }));

        fsPromises.rm(baseDir, { recursive: true });

        if (uploads.length === 0) {
            throw new Error('No files uploaded')
        }
        markJobComplete(job.data.entityId, uploads)
    } catch (error: any) {
        console.error(error)
        updateJobStatus(job.data.entityId, JobStatus.Failed)
    }
})

export { videoQueue }
