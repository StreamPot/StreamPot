import Queue from "bull";
import { JobStatus, QueueJob, Transformation } from "./types";
import { downloadFile, getPublicUrl, uploadFile } from "./storage";
import ffmpeg from 'fluent-ffmpeg'
import { getJob, markJobComplete, updateJobStatus } from "./db/jobs";

const videoQueue = new Queue("video transcoding")

function trimVideo(inputPath: string, outputPath: string, start: number, end: number) {
    return new Promise((resolve, reject) => {
        return ffmpeg(inputPath)
            .setStartTime(start / 1000)
            .setDuration((end - start) / 1000)
            .output(outputPath)
            .on('end', function () {
                resolve("complete")
                console.log('conversion ended')
            })
            .on('error', function (err) {
                console.log('error trimming video')
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

        const ext = entity.source_url.split('.').pop()
        const unmodifiedFilePath = `./media/inputs/${entity.id}.${ext}`
        const outputFilePath = `./media/outputs/${entity.id}.${ext}`
        await downloadFile(entity.source_url, unmodifiedFilePath)

        switch (entity.type) {
            case Transformation.Trim:
                await trimVideo(unmodifiedFilePath, outputFilePath, entity.payload.start_ms, entity.payload.end_ms)
                break;
            case Transformation.ExtractAudio:
                // await extractAudio(unmodifiedFilePath, outputFilePath)
                break;
        }

        updateJobStatus(entity.id, JobStatus.Uploading)

        const destinationFilePath = `outputs/${entity.id}.${ext}`
        await uploadFile(outputFilePath, destinationFilePath)

        markJobComplete(
            entity.id,
            await getPublicUrl(`outputs/${entity.id}.${ext}`)
        )
    } catch (error: any) {
        console.error(error)
    }
})

export { videoQueue }