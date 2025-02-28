"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
// src/config/env.ts
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(["development", "production", "test"])
        .default("development"),
    PORT: zod_1.z.coerce.number().default(3000),
    DATABASE_URL: zod_1.z.string().min(1, { message: "DATABASE_URL es requerida" }),
    JWT_SECRET: zod_1.z.string().min(1, { message: "JWT_SECRET es requerida" }),
    RECAPTCHA_SECRET_KEY: zod_1.z
        .string()
        .min(1, { message: "RECAPTCHA_SECRET_KEY es requerida" }),
    EMAIL_HOST: zod_1.z.string().min(1, { message: "EMAIL_HOST es requerida" }),
    EMAIL_PORT: zod_1.z.coerce.number().default(587),
    EMAIL_USER: zod_1.z.string().min(1, { message: "EMAIL_USER es requerida" }),
    EMAIL_PASS: zod_1.z.string().min(1, { message: "EMAIL_PASS es requerida" }),
    EMAIL_FROM: zod_1.z.string().min(1, { message: "EMAIL_FROM es requerida" }),
    FRONTEND_URL: zod_1.z.string().min(1, { message: "FRONTEND_URL es requerida" }),
});
const result = envSchema.safeParse(process.env);
if (!result.success) {
    console.error("Variables de entorno inválidas:", result.error.format());
    process.exit(1);
}
exports.env = result.data;
