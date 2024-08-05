const config = {
    concurrency: Number(process.env.QUEUE_CONCURRENCY) || 1,
}

export default config;
