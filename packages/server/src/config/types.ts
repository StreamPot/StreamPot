export interface Config {
    database: {
        connections: {
            pgsql: {
                url: string;
            };
            redis: {
                host: string;
                port: number;
                password: string;
            };
        }
    };
    queue: {
        concurrency: number;
    };
    filesystems: {
        [key: string]: DiskConfig
    };
}

export type DiskConfig = LocalDiskConfig | S3DiskConfig;

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

interface BaseDiskConfig {
    driver: string;
}
