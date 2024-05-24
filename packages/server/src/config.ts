export default {
    databaseUrl: process.env.DATABASE_URL,
    storage: {
        s3: {
            accessKey: process.env.S3_ACCESS_KEY,
            secretKey: process.env.S3_SECRET_KEY,
            bucketName: process.env.S3_BUCKET_NAME,
            region: process.env.S3_REGION,
            endpoint: process.env.S3_ENDPOINT,
        }
    },
    redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT as string) || 6379,
        password: process.env.REDIS_PASSWORD,
    },
    queueConcurrency: Number(process.env.QUEUE_CONCURRENCY) || 1,
    ffmpegStrategy: process.env.FFMPEG_STRATEGY || 'local' as 'docker' | 'local',
};
