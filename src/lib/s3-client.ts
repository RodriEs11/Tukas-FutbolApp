import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.S3_REGION || 'auto',
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
});

const BUCKET = process.env.S3_BUCKET_NAME!;

/**
 * Generate a presigned URL for direct upload from client
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 900 // 15 minutes
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Delete an object from S3 / MinIO / R2
 */
export async function deleteObject(key: string): Promise<void> {
  if (!key) return;

  const cleanKey = key.replace(/^\/+/, '');
  const keyWithoutBucket = cleanKey.replace(/^tukas-media\//, '');

  try {
    // 1. Eliminar con la key limpia estándar
    const command = new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: keyWithoutBucket,
    });
    await s3Client.send(command);

    // 2. Si la key original tenía prefijo duplicado tukas-media/, intentar eliminarla también
    if (cleanKey.startsWith('tukas-media/')) {
      const legacyCommand = new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: cleanKey,
      });
      await s3Client.send(legacyCommand);
    }
  } catch (error) {
    console.error(`Error deleting S3 object with key "${key}":`, error);
  }
}

/**
 * Get the public URL for a stored file
 */
export function getPublicUrl(key: string): string {
  const publicUrl = process.env.S3_PUBLIC_URL;
  if (publicUrl) {
    return `${publicUrl}/${key}`;
  }
  // Fallback: construct from endpoint
  return `${process.env.S3_ENDPOINT}/${BUCKET}/${key}`;
}
