import Queue from "bull";
import { QueueJob } from "./types";
import { getJobWithAssets } from "./db/jobsRepository";
import processWorkflow from "./actions/processWorkflow";

const videoQueue = new Queue("video transcoding", {
    redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT as string) || 6379,
        password: process.env.REDIS_PASSWORD,
    },
});

videoQueue.process(Number(process.env.QUEUE_CONCURRENCY) || 1, async (job: { data: QueueJob }) => {
    const entity = await getJobWithAssets(job.data.entityId)

    // TODO: use logger.
    console.log('processing job', job.data.entityId);

    if (!entity) {
        // TODO: use logger.
        console.log('job not found', job.data.entityId);
        return;
    }

    await processWorkflow(entity)
})

videoQueue.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed with error ${err.message}`);
});

export { videoQueue }
