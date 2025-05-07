import { config } from 'dotenv'
config({ path: '.env' })
import Fastify from 'fastify'
import sensible from '@fastify/sensible'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { videoQueue } from './queue'
import {
    JobEntityId,
    JobStatus,
    QueueJob,
    Transformation,
    FfmpegActionsRequest,
    type FfmpegActionsRequestType,
    SavedOutputAsset,
} from './types'
import {
    JobNotFoundError,
    DeletionError,
    NoOutputsError
} from './errors'
import { addJob, getAllJobs, getJobWithAssets } from './db'
import { validateBearerToken } from './auth'
import { shouldUseAPIKey } from './config'
import { deleteFilesByJobId } from './storage'

const app = Fastify({
    logger: true
}).withTypeProvider<TypeBoxTypeProvider>()

app.register(sensible)

if (shouldUseAPIKey()) {
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

export type DeleteAssetsResponse = Array<{ key: string, url: string, filename: string }>;

app.delete<{
    Params: { jobId: JobEntityId },
    Reply: {
        200: { deletedAssets: SavedOutputAsset[] },
        204: null,
        404: { message: string },
        500: { message: string }
    }
}>('/jobs/:jobId/assets', async (request, reply) => {
    try {
        const deletedKeys = await deleteFilesByJobId(request.params.jobId)
        return reply.code(200).send({ deletedAssets: deletedKeys })
    } catch (err) {
        if (err instanceof JobNotFoundError) {
            return reply.code(404).send({ message: err.message })
        }
        if (err instanceof NoOutputsError) {
            return reply.code(204).send()
        }
        if (err instanceof DeletionError) {
            request.log.error(err)
            return reply.code(500).send({ message: err.message })
        }

        request.log.error(err)
        return reply.code(500).send({ message: 'Internal Server Error' })
    }
})
export default app