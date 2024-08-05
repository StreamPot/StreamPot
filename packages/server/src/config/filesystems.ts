interface BaseDiskConfig {
    driver: string;
}

interface LocalDiskConfig extends BaseDiskConfig {
    driver: 'local';
    root: string;
}

interface S3DiskConfig extends BaseDiskConfig {
    driver: 's3';
    key: string;
    secret: string;
    region: string;
    bucket: string;
    url: string;
}

export type DiskConfig = LocalDiskConfig | S3DiskConfig;

export interface FilesystemsConfig {
    [key: string]: DiskConfig;
}

const config: FilesystemsConfig = {
    s3: {
        driver: 's3',
        key: process.env.FILESYSTEM_S3_KEY!,
        secret: process.env.FILESYSTEM_S3_SECRET!,
        region: process.env.FILESYSTEM_S3_REGION!,
        bucket: process.env.FILESYSTEM_S3_BUCKET!,
        url: process.env.FILESYSTEM_S3_URL!,
    },
    s3_fallback: {
        driver: 's3',
        key: process.env.FILESYSTEM_S3_FALLBACK_KEY!,
        secret: process.env.FILESYSTEM_S3_FALLBACK_SECRET!,
        region: process.env.FILESYSTEM_S3_FALLBACK_REGION!,
        bucket: process.env.FILESYSTEM_S3_FALLBACK_BUCKET!,
        url: process.env.FILESYSTEM_S3_FALLBACK_URL!,
    },
    local: {
        driver: 'local',
        root: process.env.FILESYSTEM_LOCAL_ROOT || 'public',
    },
}

export default config;
