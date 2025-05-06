import fs from 'node:fs';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { JobEntityId, DeleteAssetsResponse } from './types';
import { DeletionError, JobNotFoundError, NoOutputsError } from './errors';
import { getJobWithAssets } from './db/jobsRepository';

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
): Promise<DeleteAssetsResponse> {
    const job = await getJobWithAssets(id)
    if (!job) throw new JobNotFoundError(id)

    const fileMap = new Map<string, { filename: string, url: string }>();

    if (!job.outputs || Object.keys(job.outputs).length === 0) {
        throw new NoOutputsError(id)
    }

    for (const [filename, url] of Object.entries(job.outputs)) {
        const key = new URL(url as string).pathname.slice(1);
        fileMap.set(key, { filename, url: url as string });
    }

    const keys = Array.from(fileMap.keys());

    const command = new DeleteObjectsCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Delete: {
            Objects: keys.map(Key => ({ Key })),
            Quiet: false,
        },
    })

    const result = await getS3Client().send(command)
    const deleted = result.Deleted?.map(d => {
        const key = d.Key as string;
        const details = fileMap.get(key)!;
        return {
            key,
            filename: details.filename,
            url: details.url
        };
    }) || []

    if (result.Errors && result.Errors.length > 0) {
        const e = result.Errors[0]
        throw new DeletionError(e.Key as string, new Error(e.Message))
    }

    return deleted
}