import FallbackStorageService from "./FallbackStorageService";
import logger from "@/services/logger";
import config from "@/config";
import type { DiskConfig } from "@/config";
import LocalStorageDriver from "@/services/storage/LocalStorageDriver";
import S3StorageDriver from "@/services/storage/S3StorageDriver";
import StorageDriverInterface from "@/services/storage/StorageDriverInterface";

function createDriver(config: DiskConfig): StorageDriverInterface {
    switch (config.driver) {
        case 'local':
            return new LocalStorageDriver(config);
        case 's3':
            return new S3StorageDriver(config);
        default:
            // @ts-ignore ?
            throw new Error(`Unknown driver: ${config.driver}`);
    }
}

const drivers = Object.fromEntries(
    Object.entries(config.filesystems).map(([key, driverConfig]) => [
        key,
        createDriver(driverConfig)
    ])
);

export default {
    FallbackStorageService: new FallbackStorageService(logger, drivers),
}
