import { Static, Type } from '@sinclair/typebox'

export const VideoTrim = Type.Object({
    source_url: Type.String(),
    start_ms: Type.Number(),
    end_ms: Type.Number(),
})

export type VideoTrimType = Static<typeof VideoTrim>

export const ExtractAudio = Type.Object({
    source_url: Type.String(),
    output_format: Type.Optional(Type.String())
})

export type ExtractAudioType = Static<typeof ExtractAudio>
