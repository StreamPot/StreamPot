export default {
    databaseUrl: process.env.DATABASE_URL,
    redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT as string) || 6379,
        password: process.env.REDIS_PASSWORD,
    },
    queueConcurrency: Number(process.env.QUEUE_CONCURRENCY) || 1,
    ffmpegStrategy: process.env.FFMPEG_STRATEGY as 'docker' | 'local',
}
