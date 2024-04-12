import Fastify, { FastifyRequest } from 'fastify'
import dotenv from 'dotenv'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { videoQueue } from './queue'
import { VideoTrim, type VideoTrimType } from './types'
import { connectToDB } from './db/db'
import { addJob, getJob } from './db/jobs'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

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
    const jobId = job.id.toString()
    addJob(jobId, '1')
    return {
        id: job.id,
        status: 'pending',
        source_url: request.body.source_url,
    }
})

app.get<{ Params: { id: string } }>('/jobs/:id', async (request, reply) => {
    const job = await getJob(request.params.id)
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
        connectToDB()
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}
start()