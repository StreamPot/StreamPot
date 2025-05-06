const getBoolEnv = (key: string, defaultValue: boolean): boolean =>
    process.env[key] === undefined ? defaultValue : process.env[key] === "true";

export default {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT as string) || 6379,
    password: process.env.REDIS_PASSWORD || null,

    family: parseInt(process.env.REDIS_FAMILY as string) || 4,
    path: process.env.REDIS_PATH || null,
    keepAlive: parseInt(process.env.REDIS_KEEP_ALIVE as string) || 0,
    noDelay: getBoolEnv("REDIS_NO_DELAY", true),

    connectionName: process.env.REDIS_CONNECTION_NAME || null,
    db: parseInt(process.env.REDIS_DB as string) || 0,
    keyPrefix: process.env.REDIS_KEY_PREFIX || "",

    dropBufferSupport: getBoolEnv("REDIS_DROP_BUFFER_SUPPORT", false),
    stringNumbers: getBoolEnv("REDIS_STRING_NUMBERS", false),

    enableReadyCheck: getBoolEnv("REDIS_ENABLE_READY_CHECK", true),
    enableOfflineQueue: getBoolEnv("REDIS_ENABLE_OFFLINE_QUEUE", true),
    connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT as string) || 10000,
    lazyConnect: getBoolEnv("REDIS_LAZY_CONNECT", false),

    autoResubscribe: getBoolEnv("REDIS_AUTO_RESUBSCRIBE", true),
    autoResendUnfulfilledCommands: getBoolEnv("REDIS_AUTO_RESEND_UNFULFILLED_COMMANDS", true),
    readOnly: getBoolEnv("REDIS_READ_ONLY", false),
}