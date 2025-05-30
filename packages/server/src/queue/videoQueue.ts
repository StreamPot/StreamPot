import { Queue } from "bullmq";
import connection from "./connection";

const queueOptions: any = {
    connection,
};

const QUEUE_CLEANUP_MS = process.env.QUEUE_CLEANUP_MS ? Number(process.env.QUEUE_CLEANUP_MS) : undefined;

if (QUEUE_CLEANUP_MS) {
    const cleanupAgeSeconds = Math.floor(QUEUE_CLEANUP_MS / 1000);

    queueOptions.defaultJobOptions = {
        removeOnComplete: {
            age: cleanupAgeSeconds,
        },
        removeOnFail: {
            age: cleanupAgeSeconds,
        }
    };
}

export const videoQueue = new Queue("workflows", queueOptions);
