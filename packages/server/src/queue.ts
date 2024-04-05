import Queue from "bull";
import type { VideoTrimType } from "./types";
import { downloadFile } from "./storage";
import ffmpeg from 'fluent-ffmpeg'

const videoQueue = new Queue("video transcoding")

function trimVideo(inputPath: string, outputPath: string, start: number, end: number) {
    ffmpeg(inputPath)
        .setStartTime(start / 1000)
        .setDuration((end - start) / 1000)
        .output(outputPath)
        .on('end', function () {
            console.log('conversion ended')
        })
        .on('error', function (err) {
            console.log('error: ', err)
        })
        .run()
}

videoQueue.process(async (job) => {
    try {
        const data = job.data as VideoTrimType;
        const ext = data.source_url.split('.').pop()
        const unmodifiedFilePath = `./media/inputs/${job.id}.${ext}`
        const outputFilePath = `./media/outputs/${job.id}.${ext}`
        await downloadFile(data.source_url, unmodifiedFilePath)
        console.log('file downloaded')
        trimVideo(unmodifiedFilePath, outputFilePath, data.start_ms, data.end_ms)
    } catch (error: any) {
        console.error(error)
    }
})

export { videoQueue }