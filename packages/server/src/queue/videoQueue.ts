import { Queue } from "bullmq";
import config from "@/config";

export const videoQueue = new Queue("workflows", {
    connection: config.database.connections.redis,
})
