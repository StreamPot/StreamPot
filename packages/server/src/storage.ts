import fs from 'node:fs';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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
    remoteFileName: string,
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
