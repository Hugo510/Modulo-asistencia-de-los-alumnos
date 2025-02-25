// src/config/env.ts
import dotenv from "dotenv";
import { z } from "zod";

// Cargar variables desde el archivo .env
dotenv.config();

// Esquema para validar las variables de entorno
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1, { message: "DATABASE_URL es requerida" }),
  JWT_SECRET: z.string().min(1, { message: "JWT_SECRET es requerida" }),
});

// Validar y parsear process.env
const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Variables de entorno inválidas:", result.error.format());
  process.exit(1);
}

// Exportar las variables validadas para ser utilizadas en otros módulos
export const env = result.data;
