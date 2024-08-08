import { Readable } from 'stream';
import {
    StorageAdapter,
    ChecksumOptions,
    CreateDirectoryOptions,
    FileContents, MimeTypeOptions,
    PublicUrlOptions,
    StatEntry, TemporaryUrlOptions,
    WriteOptions,
    // PathPrefixer,
    CopyFileOptions,
    MoveFileOptions,
} from '@flystorage/file-storage';

export class FallbackAdapter implements StorageAdapter {
    private readonly adapters: StorageAdapter[];

    // private readonly prefixer: PathPrefixer;

    constructor(
        adapters: StorageAdapter[],
        // prefix: string,
    ) {
        this.adapters = adapters;
        // this.prefixer = new PathPrefixer(prefix);
    }

    private async callAdapter(method: string, args: any[]): Promise<any> {
        let lastError: Error | null = null;

        for (const adapter of this.adapters) {
            try {
                const result = await (adapter as any)[method](...args);
                if (result !== false) {
                    return result;
                }
            } catch (error) {
                lastError = error as Error;
            }
        }

        if (lastError) {
            throw lastError;
        }

        throw new Error(`All adapters failed for method: ${method}`);
    }

    async write(path: string, contents: Readable, options: WriteOptions): Promise<void> {
        return this.callAdapter('write', [path, contents, options]);
    }

    async read(path: string): Promise<FileContents> {
        return this.callAdapter('read', [path]);
    }

    async deleteFile(path: string): Promise<void> {
        return this.callAdapter('deleteFile', [path]);
    }

    async createDirectory(path: string, options: CreateDirectoryOptions): Promise<void> {
        return this.callAdapter('createDirectory', [path, options]);
    }

    async stat(path: string): Promise<StatEntry> {
        return this.callAdapter('stat', [path]);
    }

    async* list(path: string, options: { deep: boolean }): AsyncGenerator<StatEntry> {
        for (const adapter of this.adapters) {
            try {
                for await (const entry of adapter.list(path, options)) {
                    yield entry;
                }
                return;
            } catch (error) {
                // Continue to the next adapter if this one fails
            }
        }
        throw new Error('All adapters failed for list method');
    }

    async changeVisibility(path: string, visibility: string): Promise<void> {
        return this.callAdapter('changeVisibility', [path, visibility]);
    }

    async visibility(path: string): Promise<string> {
        return this.callAdapter('visibility', [path]);
    }

    async deleteDirectory(path: string): Promise<void> {
        return this.callAdapter('deleteDirectory', [path]);
    }

    async fileExists(path: string): Promise<boolean> {
        return this.callAdapter('fileExists', [path]);
    }

    async directoryExists(path: string): Promise<boolean> {
        return this.callAdapter('directoryExists', [path]);
    }

    async publicUrl(path: string, options: PublicUrlOptions): Promise<string> {
        return this.callAdapter('publicUrl', [path, options]);
    }

    async temporaryUrl(path: string, options: TemporaryUrlOptions): Promise<string> {
        return this.callAdapter('temporaryUrl', [path, options]);
    }

    async checksum(path: string, options: ChecksumOptions): Promise<string> {
        return this.callAdapter('checksum', [path, options]);
    }

    async mimeType(path: string, options: MimeTypeOptions): Promise<string> {
        return this.callAdapter('mimeType', [path, options]);
    }

    async lastModified(path: string): Promise<number> {
        return this.callAdapter('lastModified', [path]);
    }

    async fileSize(path: string): Promise<number> {
        return this.callAdapter('fileSize', [path]);
    }

    async copyFile(from: string, to: string, options: CopyFileOptions): Promise<void> {
        return this.callAdapter('copyFile', [from, to, options]);
    }

    async moveFile(from: string, to: string, options: MoveFileOptions): Promise<void> {
        return this.callAdapter('moveFile', [from, to, options]);
    }
}
