import { config } from 'dotenv'
config({ path: '.env' })
import Fastify from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { videoQueue } from './queue'
import {
    JobEntityId,
    JobStatus,
    QueueJob,
    Transformation,
    FfmpegActionsRequest,
    type FfmpegActionsRequestType
} from './types'
import { addJob, getAllJobs, getJobWithAssets } from './db/jobsRepository'
import { validateBearerToken } from './auth'

const app = Fastify({
    logger: true
}).withTypeProvider<TypeBoxTypeProvider>()

if (process.env.API_KEY) {
    app.addHook('preHandler', validateBearerToken)
}

app.post<{ Body: FfmpegActionsRequestType }>('/', {
    schema: {
        body: FfmpegActionsRequest,
    },
}, async (request, reply) => {
    const entity = await addJob({
        type: Transformation.Actions,
        user_id: '1',
        status: JobStatus.Pending,
        payload: request.body
    })

    await videoQueue.add(`workflow-${entity.id}`, <QueueJob>{ entityId: entity.id })

    return {
        id: entity.id,
        status: entity.status,
        created_at: entity.created_at,
    }
})

app.get<{ Params: { id: JobEntityId } }>('/jobs/:id', async (request, reply) => {
    const job = await getJobWithAssets(request.params.id)

    if (!job) {
        reply.code(404)
        return { message: 'Job not found' }
    }

    return job
})

app.get('/jobs', async () => {
    return await getAllJobs()
})

export default app
