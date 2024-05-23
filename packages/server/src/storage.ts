import fs from 'node:fs';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import config from "./config";

let s3Client: S3Client | null = null;

export function getS3Client() {
    if (s3Client) {
        return s3Client;
    }

    return s3Client = new S3Client({
        endpoint: config.storage.s3.endpoint,
        credentials: {
            accessKeyId: config.storage.s3.accessKey,
            secretAccessKey: config.storage.s3.secretKey
        },
        region: config.storage.s3.region,
        forcePathStyle: true
    });
}

export async function uploadFile({ localFilePath, remoteFileName }: {
    localFilePath: string,
    remoteFileName: string
}) {
    const fileStream = fs.createReadStream(localFilePath);

    const command = new PutObjectCommand({
        Bucket: config.storage.s3.bucketName,
        Key: remoteFileName,
        Body: fileStream,
        ACL: 'public-read',
    });

    return await getS3Client().send(command);
}

export async function getPublicUrl(key: string) {
    const command = new GetObjectCommand({
        Bucket: config.storage.s3.bucketName,
        Key: key,
    });

    return await getSignedUrl(getS3Client(), command, { expiresIn: 3600 });
}
