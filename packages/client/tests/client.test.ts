import { expect, test } from 'vitest'
import { StreamPot } from '../src'

const EXAMPLE_BUNNY_MP4_1MB = "https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4"

const client = new StreamPot({
    secret: 'secret',
    baseUrl: 'http://localhost:3000',
})

test('Client test', async () => {
    const clipJob = await client.input(EXAMPLE_BUNNY_MP4_1MB)
        .setStartTime(1)
        .setDuration(2)
        .output('output.mp4')
        .run()

    console.log(clipJob);

    expect(clipJob).toHaveProperty('id')
    expect(clipJob).toHaveProperty('status')
})

test('Client test multi outputs', async () => {
    const clipJob = await client.input(EXAMPLE_BUNNY_MP4_1MB)
        .setStartTime(1)
        .setDuration(2)
        .output('test/output_video.mp4')
        .noAudio()
        .output('output_audio.mp3')
        .noVideo()
        .audioCodec('libmp3lame')
        .audioBitrate(192)
        .outputOptions([
            '-write_xing 0',
            '-af asetpts=N/SR/TB',
            '-id3v2_version', '3'
        ])
        .run()
    expect(clipJob).toHaveProperty('id')
    expect(clipJob).toHaveProperty('status')
})