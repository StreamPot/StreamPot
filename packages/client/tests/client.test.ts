import { expect, test } from 'vitest'
import { StreamPot } from '../src'

const EXAMPLE_BUNNY_MP4_1MB = "https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4"
const EXAMPLE_WATERMARK_ORANGE = 'https://pngfre.com/wp-content/uploads/orange-poster.png'

const BASE_URL = 'http://127.0.0.1:3000'

test('Client test', async () => {
    const client = new StreamPot({
        secret: 'secret',
        baseUrl: BASE_URL,
    })

    const clipJob = await client.input(EXAMPLE_BUNNY_MP4_1MB)
        .setStartTime(1)
        .setDuration(2)
        .output('output.mp4')
        .run()

    console.log(clipJob);

    expect(clipJob).toHaveProperty('id')
    expect(clipJob).toHaveProperty('status')
})

test('Client test multi inputs', async () => {
    const client = new StreamPot({
        secret: 'secret',
        baseUrl: BASE_URL,
    })
    const clipJob = await client
        .input(EXAMPLE_BUNNY_MP4_1MB)
        .input(EXAMPLE_BUNNY_MP4_1MB)
        .videoCodec('libx264')
        .complexFilter([
            '[0:v]scale=400:300[0scaled]',
            '[1:v]scale=400:300[1scaled]',
            '[0scaled]pad=800:300[0padded]',
            '[0padded][1scaled]overlay=shortest=1:x=400[output]',
            'amix=inputs=2:duration=shortest',  ///////// here
        ]).outputOptions(['-map [output]'])
        .output('output.mp4')
        .run();
    console.log(clipJob);
})

test('add watermark image', async () => {
    const client = new StreamPot({
        secret: 'secret',
        baseUrl: BASE_URL,
    })

    const clipJob = await client.input(EXAMPLE_BUNNY_MP4_1MB)
        .input(EXAMPLE_WATERMARK_ORANGE)
        .complexFilter([
            {
                filter: 'scale',
                options: { w: 'iw*0.1', h: 'ih*0.1' },
                inputs: '1:v',
                outputs: 'scaled'
            },
            {
                filter: 'overlay',
                options: { x: 100, y: 100 },
                inputs: ['0:v', 'scaled']
            }
        ])
        .output('output5.mp4')
        .run()
    console.log(clipJob);
})
