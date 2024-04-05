import { expect, test } from 'vitest'
import { StreamPot } from '../src'

const EXAMPLE_BUNNY_MP4_1MB = "https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4"

const client = new StreamPot({
    secret: 'secret',
    baseUrl: 'http://localhost:3000',
})

test('Client test', async () => {
    const clipJob = await client.input(EXAMPLE_BUNNY_MP4_1MB).startAt(1).endAt(2).run()

    console.log(clipJob);

    expect(clipJob).toHaveProperty('id')
    expect(clipJob).toHaveProperty('status')
    expect(clipJob).toHaveProperty('source_url')
})