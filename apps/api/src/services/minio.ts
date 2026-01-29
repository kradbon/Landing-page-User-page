import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "../config";

export const s3 = new S3Client({
  region: "us-east-1",
  endpoint: config.minio.endpoint,
  credentials: {
    accessKeyId: config.minio.accessKey,
    secretAccessKey: config.minio.secretKey
  },
  forcePathStyle: true
});

export async function presignUpload(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: config.minio.bucket,
    Key: key,
    ContentType: contentType
  });
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 600 });
  const publicUrl = `${config.minio.publicUrl}/${config.minio.bucket}/${key}`;
  return { uploadUrl, publicUrl };
}

export async function putObject(key: string, body: Buffer | string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: config.minio.bucket,
    Key: key,
    Body: body,
    ContentType: contentType
  });
  await s3.send(command);
  return `${config.minio.publicUrl}/${config.minio.bucket}/${key}`;
}
