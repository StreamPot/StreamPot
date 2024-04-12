import Fastify, { FastifyRequest } from 'fastify'
import dotenv from 'dotenv'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { videoQueue } from './queue'
import { ExtractAudio, ExtractAudioType, JobEntityId, JobStatus, QueueJob, Transformation, VideoTrim, type VideoTrimType } from './types'
import { addJob, getAllJobs, getJob } from './db/jobs'
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
    const entity = await addJob({
        type: Transformation.Trim,
        user_id: '1',
        status: JobStatus.Pending,
        source_url: request.body.source_url,
        payload: request.body
    })

    await videoQueue.add(<QueueJob>{ entityId: entity.id })

    return {
        id: entity.id,
        status: entity.status,
        source_url: entity.source_url,
    }
})

app.post<{ Body: ExtractAudioType }>('/extract-audio', {
    schema: {
        body: ExtractAudio,
    },
}, async (request, reply) => {
    const entity = await addJob({
        type: Transformation.ExtractAudio,
        user_id: '1',
        status: JobStatus.Pending,
        source_url: request.body.source_url,
        payload: request.body
    })

    await videoQueue.add(<QueueJob>{ entityId: entity.id })

    return {
        id: entity.id,
        status: entity.status,
        source_url: entity.source_url,
    }
})

app.get<{ Params: { id: JobEntityId } }>('/jobs/:id', async (request, reply) => {
    const job = await getJob(request.params.id)
    if (!job) {
        reply.code(404)
        return {
            message: 'Job not found'
        }
    }
    return job
})

app.get('/jobs', async () => {
    return await getAllJobs()
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