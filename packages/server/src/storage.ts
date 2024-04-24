import fs from 'fs'
import { S3 } from 'aws-sdk';

let S3Client: S3 | null = null

export async function downloadFile(url: string, path: string) {
    try {
        const response = await fetch(url, {
            method: 'GET',
        })
        const buffer = await response.arrayBuffer()
        fs.writeFileSync(path, Buffer.from(buffer))
    }
    catch (err: any) {
        console.log("error downloading file")
        console.log(err)
    }
}

export function getS3Client() {
    if (S3Client) return S3Client

    if (!process.env.S3_ACCESS_KEY) throw new Error('S3_ACCESS_KEY not set')
    if (!process.env.S3_SECRET_ACCESS_KEY) throw new Error('S3_SECRET_ACCESS_KEY not set')
    // if (!process.env.S3_REGION) throw new Error('S3_REGION not set')
    if (!process.env.S3_BUCKET_NAME) throw new Error('S3_BUCKET_NAME not set')

    return S3Client = new S3({
        endpoint: process.env.S3_ENDPOINT,
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        region: process.env.S3_REGION,
        s3ForcePathStyle: true,
        signatureVersion: 'v4'
    });
}

export async function uploadFile(file: string, key: string) {
    try {
        const bucketName = process.env.S3_BUCKET_NAME
        const fileContent = fs.readFileSync(file);
        if (!bucketName) throw new Error('Bucket name not set')

        const s3 = getS3Client()
        console.log({
            Bucket: bucketName,
            Key: key,
            Body: fileContent
        })
        const data = await s3.upload({
            Bucket: bucketName,
            Key: key,
            Body: fileContent
        }).promise();

        console.log(data);

        console.log(`File uploaded successfully. ${data.Location}`);
        return data
    } catch (err) {
        console.error("Error uploading file: ", err);
    }
};

export async function getPublicUrl(key: string) {
    const bucketName = process.env.S3_BUCKET_NAME
    if (!bucketName) throw new Error('Bucket name not set')

    const s3 = getS3Client()
    const params = {
        Bucket: bucketName,
        Key: key,
    };
    const url = await s3.getSignedUrlPromise('getObject', params);
    return url
}