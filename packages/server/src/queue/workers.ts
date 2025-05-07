import { Worker } from "bullmq";
import { QueueJob } from "../types";
import { getJobWithAssets } from "../db";
import processWorkflow from "../actions/processWorkflow";
import connection from "./connection";

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
        connection,
        concurrency: Number(process.env.QUEUE_CONCURRENCY) || 1,
    })

    videoQueueWorker.on('failed', (job, err) => {
        console.error(`Job ${job.id} failed with error ${err.message}`);
    });
}
