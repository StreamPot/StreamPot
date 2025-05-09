import fs from 'node:fs';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { JobEntityId, SavedOutputAsset } from './types';
import { DeletionError, JobNotFoundError, NoOutputsError } from './errors';
import { getAssetsByJobId, markAssetAsDeleted } from './db';


let s3Client: S3Client | null = null;

export function getS3Client() {
    if (s3Client) {
        return s3Client;
    }

    return s3Client = new S3Client({
        endpoint: process.env.S3_ENDPOINT,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY,
        },
        region: process.env.S3_REGION,
        forcePathStyle: true
    });
}

export async function uploadFile({ localFilePath, remoteFileName }: {
    localFilePath: string,
    remoteFileName: string
}) {
    const fileStream = fs.createReadStream(localFilePath);

    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: remoteFileName,
        Body: fileStream,
        ACL: 'public-read',
    });

    return await getS3Client().send(command);
}

export async function getPublicUrl(key: string) {
    return `https://${process.env.S3_PUBLIC_DOMAIN}/${key}`;
}

export async function deleteFilesByJobId(
    id: JobEntityId
): Promise<SavedOutputAsset[]> {

    const assets = await getAssetsByJobId(id);
    const assetsToDelete = assets.filter(a => a.type === 'output' && a.deleted_at === null);

    if (assetsToDelete.length === 0) {
        throw new NoOutputsError(id);
    }

    const assetDict: Record<string, SavedOutputAsset> = {};
    for (const asset of assetsToDelete) {
        assetDict[asset.storedPath] = asset;
    }

    const cmd = new DeleteObjectsCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Delete: {
            Objects: Object.keys(assetDict).map(Key => ({ Key })),
            Quiet: false,
        },
    });
    const result = await getS3Client().send(cmd);

    if (result.Errors && result.Errors.length > 0) {
        const e = result.Errors[0];
        throw new DeletionError(e.Key as string, new Error(e.Message));
    }

    const deletedKeys = (result.Deleted ?? [])
        .map(d => d.Key)
        .filter((k): k is string => Boolean(k));

    const marked = await Promise.all(
        deletedKeys
            .map(key => assetDict[key])
            .filter((asset): asset is SavedOutputAsset => asset !== undefined)
            .map(asset => markAssetAsDeleted(asset.id))
    );

    return marked;
}