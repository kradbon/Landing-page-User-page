import { z } from "zod";

const EnvSchema = z.object({
  MONGODB_URI: z.string().default("mongodb://localhost:27017/brooklyn_lms"),
  MINIO_ENDPOINT: z.string().default("http://localhost:9000"),
  MINIO_PUBLIC_URL: z.string().optional(),
  MINIO_ACCESS_KEY: z.string().default("minioadmin"),
  MINIO_SECRET_KEY: z.string().default("minioadmin"),
  MINIO_BUCKET: z.string().default("brooklyn-lms"),
  BASE_DOMAIN: z.string().default("ourdomain.com"),
  AUTH_API_BASE_URL: z.string().optional(),
  USER_PAGE_BASE_URL: z.string().optional(),
  PUBLIC_BASE_URL: z.string().optional(),
  JWT_SECRET: z.string().optional(),
  API_PORT: z.string().default("3000"),
  ADMIN_TENANT_ID: z.string().default("arkon"),
  ADMIN_USER_ID: z.string().default("admin-user"),
  ADMIN_EMAIL: z.string().default("admin@arkon.com")
});

const parsed = EnvSchema.parse(process.env);

export const config = {
  mongoUri: parsed.MONGODB_URI,
  minio: {
    endpoint: parsed.MINIO_ENDPOINT,
    publicUrl: parsed.MINIO_PUBLIC_URL || parsed.MINIO_ENDPOINT,
    accessKey: parsed.MINIO_ACCESS_KEY,
    secretKey: parsed.MINIO_SECRET_KEY,
    bucket: parsed.MINIO_BUCKET
  },
  baseDomain: parsed.BASE_DOMAIN,
  authApiBaseUrl: parsed.AUTH_API_BASE_URL || "",
  userPageBaseUrl: parsed.USER_PAGE_BASE_URL || "",
  publicBaseUrl: parsed.PUBLIC_BASE_URL || "",
  jwtSecret: parsed.JWT_SECRET || "",
  port: Number(parsed.API_PORT),
  devAdmin: {
    tenantId: parsed.ADMIN_TENANT_ID,
    userId: parsed.ADMIN_USER_ID,
    email: parsed.ADMIN_EMAIL
  }
};
