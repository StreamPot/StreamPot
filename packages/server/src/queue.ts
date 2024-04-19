import Queue from "bull";
import { FfmpegActionsRequestType, JobStatus, QueueJob, Transformation } from "./types";
import { downloadFile, getPublicUrl, uploadFile } from "./storage";
import ffmpeg from 'fluent-ffmpeg'
import { getJob, markJobComplete, updateJobStatus } from "./db/jobs";

const videoQueue = new Queue("video transcoding")

function runActions(payload: FfmpegActionsRequestType) {

}

function extractAudio(inputPath: string, outputPath: string) {
    return new Promise((resolve, reject) => {
        return ffmpeg(inputPath)
            .output(outputPath)
            .on('end', function () {
                resolve("complete")
                console.log('conversion ended')
            })
            .on('error', function (err) {
                console.log('error extracting audio')
                console.log('error: ', err)
                reject(err)
            })
            .run()
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



        let localOutputPath: string;
        let destinationFilePath: string;

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