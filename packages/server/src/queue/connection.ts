export default {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT as string) || 6379,
    password: process.env.REDIS_PASSWORD,
}
