import Queue from "bull";
import { QueueJob } from "./types";
import { getJob } from "./db/jobsRepository";
import processWorkflow from "./actions/processWorkflow";
import config from "./config";

const videoQueue = new Queue("video transcoding", {
    redis: config.redis,
});

videoQueue.process(config.queueConcurrency, async (job: { data: QueueJob }) => {
    const entity = await getJob(job.data.entityId)

    // TODO: use logger.
    console.log('processing job', job.data.entityId);

    if (!entity) {
        // TODO: use logger.
        console.log('job not found', job.data.entityId);
        return;
    }

    await processWorkflow(entity)
})

export { videoQueue }
