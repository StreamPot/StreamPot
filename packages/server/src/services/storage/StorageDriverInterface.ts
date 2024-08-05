export default interface StorageDriverInterface {
    uploadFile(fileBuffer: Buffer, remoteFileName: string): Promise<void>;

    deleteFile(storedPath: string): Promise<void>;

    getFileUrl(storedPath: string): string;
}
