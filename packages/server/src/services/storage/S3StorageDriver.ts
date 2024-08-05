import StorageDriverInterface from "./StorageDriverInterface";

export default class S3StorageDriver implements StorageDriverInterface {
    constructor(config) {
    }

    uploadFile(fileBuffer: Buffer, remoteFileName: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    deleteFile(storedPath: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    getFileUrl(storedPath: string): string {
        throw new Error("Method not implemented.");
    }
}
