import LoggerInterface from "@/services/logger/LoggerInterface";
import StorageDriverInterface from "@/services/storage/StorageDriverInterface";

interface UploadResult {
    driver: string;
    publicUrl: string;
    fileName: string;
}

export default class FallbackStorageService {
    constructor(
        protected readonly logger: LoggerInterface,
        protected readonly filesystems: { [key: string]: StorageDriverInterface }
    ) {
    }

    async uploadFile(fileBuffer: Buffer, remoteFileName: string): Promise<UploadResult> {
        throw new Error("Method not implemented.");
    }
}
