import config from "@/config";
import { DiskConfig, DiskDriver, LocalDiskConfig, S3DiskConfig } from "@/config/types";
import { FileStorage, StorageAdapter } from '@flystorage/file-storage';
import { AwsS3StorageAdapter } from '@flystorage/aws-s3';
import { S3Client } from '@aws-sdk/client-s3';
import { LocalStorageAdapter } from "@flystorage/local-fs";
import { FallbackAdapter } from "./FallbackAdapter";

function createLocalDriver(config: LocalDiskConfig) {
    return new LocalStorageAdapter(config.root);
}

function createS3Driver(config: S3DiskConfig) {
    const client = new S3Client({
        credentials: {
            accessKeyId: config.key,
            secretAccessKey: config.secret,
        },
        region: config.region,
    });

    return new AwsS3StorageAdapter(client, {
        bucket: '{your-bucket-name}',
        prefix: '{optional-path-prefix}',
    });
}

function createDriver(config: DiskConfig): StorageAdapter {
    if (!config.driver) {
        throw new Error('Missing driver in disk config');
    }

    switch (config.driver) {
        case DiskDriver.Local:
            return createLocalDriver(config);
        case DiskDriver.S3:
            return createS3Driver(config);
        default:
            // TODO: Find out why TS can't infer the type of config.driver
            // @ts-ignore
            throw new Error(`Unsupported driver: ${config.driver}`);
    }
}

//
// const drivers = Object.fromEntries(
//     Object.entries(config.filesystems).map(([key, driverConfig]) => [
//         key,
//         createDriver(driverConfig)
//     ])
// );
// isntead, make it an array
const drivers = Object.entries(config.filesystems).map(([key, driverConfig]) => createDriver(driverConfig));

export default new FileStorage(new FallbackAdapter(drivers));
