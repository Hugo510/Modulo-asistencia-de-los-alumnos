// src/config/env.ts
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1, { message: "DATABASE_URL es requerida" }),
  JWT_SECRET: z.string().min(1, { message: "JWT_SECRET es requerida" }),
  EMAIL_HOST: z.string().min(1, { message: "EMAIL_HOST es requerida" }),
  EMAIL_PORT: z.coerce.number().default(587),
  EMAIL_USER: z.string().min(1, { message: "EMAIL_USER es requerida" }),
  EMAIL_PASS: z.string().min(1, { message: "EMAIL_PASS es requerida" }),
  EMAIL_FROM: z.string().min(1, { message: "EMAIL_FROM es requerida" }),
  FRONTEND_URL: z.string().min(1, { message: "FRONTEND_URL es requerida" }),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Variables de entorno inválidas:", result.error.format());
  process.exit(1);
}

export const env = result.data;
