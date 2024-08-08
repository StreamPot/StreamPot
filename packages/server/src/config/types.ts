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

export enum DiskDriver {
    Local = 'local',
    S3 = 's3'
}

export type DiskConfig = LocalDiskConfig | S3DiskConfig;

export interface LocalDiskConfig extends BaseDiskConfig {
    driver: DiskDriver.Local;
    root: string;
}

export interface S3DiskConfig extends BaseDiskConfig {
    driver: DiskDriver.S3;
    key: string;
    secret: string;
    region: string;
    bucket: string;
    url: string;
}

interface BaseDiskConfig {
    driver: DiskDriver;
}
