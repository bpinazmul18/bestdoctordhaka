import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getRequiredEnv } from "@/lib/utils/env";

const MIME_TYPE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const ALLOWED_IMAGE_MIME_TYPES = new Set(Object.keys(MIME_TYPE_EXTENSIONS));
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

function createR2Client() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${getRequiredEnv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: getRequiredEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: getRequiredEnv("R2_SECRET_ACCESS_KEY"),
    },
  });
}

const globalForR2 = globalThis as unknown as {
  r2Client?: S3Client;
};

/**
 * Built lazily (only when an upload/delete actually happens) rather than at
 * module load, so pages that merely import this module don't hard-fail
 * before R2 credentials are configured.
 */
function getR2Client(): S3Client {
  if (!globalForR2.r2Client) {
    globalForR2.r2Client = createR2Client();
  }
  return globalForR2.r2Client;
}

export function extensionForImageMimeType(mimeType: string): string | null {
  return MIME_TYPE_EXTENSIONS[mimeType] ?? null;
}

export function buildR2PublicUrl(key: string): string {
  return `${getRequiredEnv("R2_PUBLIC_URL").replace(/\/$/, "")}/${key}`;
}

export async function uploadPublicObject(params: {
  key: string;
  body: Buffer;
  contentType: string;
}): Promise<string> {
  await getR2Client().send(
    new PutObjectCommand({
      Bucket: getRequiredEnv("R2_BUCKET_NAME"),
      Key: params.key,
      Body: params.body,
      ContentType: params.contentType,
    }),
  );

  return buildR2PublicUrl(params.key);
}

export async function deleteObject(key: string): Promise<void> {
  await getR2Client().send(
    new DeleteObjectCommand({
      Bucket: getRequiredEnv("R2_BUCKET_NAME"),
      Key: key,
    }),
  );
}
