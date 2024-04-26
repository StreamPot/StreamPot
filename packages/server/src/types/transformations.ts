import { Static, Type } from '@sinclair/typebox'

export const FfmpegActionsRequest = Type.Array(Type.Object({
    name: Type.String(),
    value: Type.Any(),
}))

export type FfmpegActionsRequestType = Static<typeof FfmpegActionsRequest>
