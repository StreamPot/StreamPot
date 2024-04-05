import { expect, test } from 'vitest'
import { downloadFile } from '../src/storage'
import { cleanUpArtifact, doesArtifactExist, getArtifactPath } from './artifacts'

const EXAMPLE_BUNNY_MP4_1MB = "https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4"
const EXAMPLE_BUNNY_FLV_1MB = "https://sample-videos.com/video321/flv/240/big_buck_bunny_240p_1mb.flv"

test('Downloads small mp4 file', async () => {
    const outputPath = getArtifactPath('bunny.mp4')

    await downloadFile(EXAMPLE_BUNNY_MP4_1MB, outputPath)

    expect(doesArtifactExist(outputPath)).toBe(true)

    cleanUpArtifact(outputPath)
})

test('Downloads small flv file', async () => {
    const outputPath = getArtifactPath('bunny.flv')

    await downloadFile(EXAMPLE_BUNNY_FLV_1MB, outputPath)

    expect(doesArtifactExist(outputPath)).toBe(true)

    cleanUpArtifact(outputPath)
})

