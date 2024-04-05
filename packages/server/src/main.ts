import Fastify, { FastifyRequest } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { videoQueue } from './queue'
import { VideoTrim, type VideoTrimType } from './types'
import db from './db'

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
    const job = await videoQueue.add({
        source_url: request.body.source_url,
        start_ms: request.body.start_ms,
        end_ms: request.body.end_ms
    })
    db.jobs.set(job.id, {
        status: 'pending',
        source_url: request.body.source_url,
        output_url: null,
    })

    return {
        id: job.id,
        status: 'pending',
        source_url: request.body.source_url,
    }
})

app.get<{ Params: { id: string } }>('/jobs/:id', async (request, reply) => {
    const job = db.jobs.get(request.params.id)
    if (!job) {
        reply.code(404)
        return {
            message: 'Job not found'
        }
    }
    return job
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