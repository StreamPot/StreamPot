import { Worker } from "bullmq";
import { QueueJob } from "../types";
import { getJobWithAssets } from "../db/jobsRepository";
import processWorkflow from "../actions/processWorkflow";
import config from "../config";

export function startWorkers() {
    const videoQueueWorker = new Worker("workflows", async (job: { data: QueueJob }) => {
        const entity = await getJobWithAssets(job.data.entityId)

        if (!entity) {
            // TODO: use logger.
            console.log('job not found', job.data.entityId);
            return;
        }

        await processWorkflow(entity)
    }, {
        connection: config.database.connections.redis,
        concurrency: config.queue.concurrency,
    })

    videoQueueWorker.on('failed', (job, err) => {
        console.error(`Job ${job.id} failed with error ${err.message}`);
    });
}
