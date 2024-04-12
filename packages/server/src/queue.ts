import Queue from "bull";
import type { VideoTrimType } from "./types";
import { downloadFile } from "./storage";
import ffmpeg from 'fluent-ffmpeg'
import { markJobComplete } from "./db/jobs";

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

videoQueue.process(async (job) => {
    try {
        const data = job.data as VideoTrimType;
        const ext = data.source_url.split('.').pop()
        const unmodifiedFilePath = `./media/inputs/${job.id}.${ext}`
        const outputFilePath = `./media/outputs/${job.id}.${ext}`
        await downloadFile(data.source_url, unmodifiedFilePath)
        await trimVideo(unmodifiedFilePath, outputFilePath, data.start_ms, data.end_ms)
        const id = job.id.toString()
        markJobComplete(id, outputFilePath)
    } catch (error: any) {
        console.error(error)
    }
})

export { videoQueue }