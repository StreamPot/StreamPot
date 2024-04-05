import Fastify, { FastifyRequest } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { videoQueue } from './queue'
import { VideoTrim, type VideoTrimType } from './types'

const app = Fastify({
    logger: true
}).withTypeProvider<TypeBoxTypeProvider>()

app.post<{ Body: VideoTrimType }>('/clip', {
    schema: {
        body: VideoTrim,
        // response: {
        //     200: User
        // },
    },
}, async (request, reply) => {
    console.log("request body", request.body);

    console.log("adding job to queue")
    // TO DO - validate that it is a video file format
    videoQueue.add({
        source_url: request.body.source_url,
        start_ms: request.body.start_ms,
        end_ms: request.body.end_ms
    })

    return {
        id: '123',
        status: 'pending',
        source_url: request.body.source_url,
    }
})

const start = async () => {
    try {
        await app.listen({ port: 3000 })
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}
start()