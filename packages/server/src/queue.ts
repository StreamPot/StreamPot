import Queue from "bull";
import { FfmpegActionsRequestType, JobStatus, QueueJob, Transformation } from "./types";
import { downloadFile, getPublicUrl, uploadFile } from "./storage";
import ffmpeg, { FfmpegCommand } from 'fluent-ffmpeg'
import { getJob, markJobComplete, updateJobStatus } from "./db/jobs";

const videoQueue = new Queue("video transcoding")

const allowedActions = [
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

async function runActions(payload: FfmpegActionsRequestType) {
    const ffmpegCommand = ffmpeg();

    for (const action of payload) {
        if (action.name in allowedActions) {
            ffmpegCommand[action.name](action.value)
        }
    }

    // brb. 16:46 - 16:48

    return new Promise((resolve, reject) => {
        ffmpegCommand.on('end', resolve)
        ffmpegCommand.on('error', reject)
        ffmpegCommand.run()
    })
}

videoQueue.process(async (job: { data: QueueJob }) => {
    try {
        const entity = await getJob(job.data.entityId)

        if (!entity) {
            console.log('job not found', job.data.entityId);

            return;
        }

        console.log('processing job', entity.id);

        switch (entity.type) {
            case Transformation.Actions:
                await runActions(entity.payload)
                break;
        }

        updateJobStatus(entity.id, JobStatus.Uploading)


    } catch (error: any) {
        console.error(error)
    }
})

export { videoQueue }
