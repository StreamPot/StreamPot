import Queue from "bull";
import fs, { promises as fsPromises } from 'fs';
import { FfmpegActionsRequestType, JobStatus, QueueJob } from "./types";
import ffmpeg, { FfmpegCommand } from 'fluent-ffmpeg'
import { getJob, markJobComplete, updateJobStatus } from "./db/jobs";
import { getPublicUrl, uploadFile } from "./storage";

const videoQueue = new Queue("video transcoding")
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
];

function safeFfmpegCall(command: FfmpegCommand, methodName: keyof FfmpegCommand, values: any[]) {
    const method: Function | undefined = command[methodName];

    if (typeof method === 'function') {
        method.apply(command, values);
    } else {
        throw new Error(`Method ${String(methodName)} is not a function on FfmpegCommand.`);
    }
}

async function runActions(payload: FfmpegActionsRequestType, id: number) {
    const ffmpegCommand = ffmpeg();
    const dir = `/tmp/${id}`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    const outputModifiedActions: FfmpegActionsRequestType = payload.map(action => {
        if (action.name === 'output') {
            const fileName = action.value.split('/').pop();
            return { name: 'output', value: `${dir}/${fileName}` }
        }
        else return action
    })

    for (const action of outputModifiedActions) {
        const methodName = action.name as keyof FfmpegCommand;
        if (allowedActions.includes(methodName)) {
            safeFfmpegCall(ffmpegCommand, methodName, [action.value]); // Wrap action.value in an array
        }
    }


    // const output = `${dir}/vid.mp4`;
    // ffmpegCommand.output(output);

    return new Promise((resolve, reject) => {
        ffmpegCommand.on('end', resolve)
        ffmpegCommand.on('error', reject)
        ffmpegCommand
            .run()
    })
}

videoQueue.process(async (job: { data: QueueJob }) => {
    try {
        const uploads: any = []
        const entity = await getJob(job.data.entityId)

        if (!entity) {
            console.log('job not found', job.data.entityId);
            return;
        }
        await runActions(entity.payload, job.data.entityId)
        console.log('ran the actions ')
        updateJobStatus(entity.id, JobStatus.Uploading)
        for (const file of fs.readdirSync(`/tmp/${job.data.entityId}`)) {
            const upload: any = await uploadFile(`/tmp/${job.data.entityId}/${file}`, `${job.data.entityId}-${file}`)
            const publicUrl = await getPublicUrl(upload.Key)
            uploads.push(publicUrl)
            console.log('public url ', publicUrl)
        }
        // delete all the files in the directory
        await fsPromises.rm(`/tmp/${job.data.entityId}`, { recursive: true });
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
