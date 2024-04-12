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

        const sourceExt = entity.source_url.split('.').pop()
        const localSourcePath = `./media/inputs/${entity.id}.${sourceExt}`
        await downloadFile(entity.source_url, localSourcePath)

        let localOutputPath: string;
        let destinationFilePath: string;

        switch (entity.type) {
            case Transformation.Trim:
                localOutputPath = `./media/outputs/${entity.id}.${sourceExt}`
                destinationFilePath = `outputs/${entity.id}.${sourceExt}`
                await trimVideo(localSourcePath, localOutputPath, entity.payload.start_ms, entity.payload.end_ms)
                break;
            case Transformation.ExtractAudio:
                const outputExt = entity.payload.output_format || 'mp3'
                localOutputPath = `./media/outputs/${entity.id}.${outputExt}`
                await extractAudio(localSourcePath, localOutputPath)

                destinationFilePath = `outputs/${entity.id}.${outputExt}`
                break;
        }

        updateJobStatus(entity.id, JobStatus.Uploading)

        await uploadFile(localOutputPath, destinationFilePath)

        markJobComplete(
            entity.id,
            await getPublicUrl(destinationFilePath)
        )
    } catch (error: any) {
        console.error(error)
    }
})

export { videoQueue }