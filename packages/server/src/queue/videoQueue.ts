import { Queue, QueueOptions } from "bullmq";
import connection from "./connection";

const queueOptions: QueueOptions = {
    connection,
};

const QUEUE_CLEANUP_MS = process.env.QUEUE_CLEANUP_MS
    ? Number(process.env.QUEUE_CLEANUP_MS)
    : undefined;

if (!Number.isNaN(QUEUE_CLEANUP_MS) && QUEUE_CLEANUP_MS) {
    const age = Math.floor(QUEUE_CLEANUP_MS / 1000);
    queueOptions.defaultJobOptions = {
        removeOnComplete: { age },
        removeOnFail: { age },
    };
}

export const videoQueue = new Queue("workflows", queueOptions);