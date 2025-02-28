"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordDtoSchema = exports.PasswordRecoveryDtoSchema = exports.LoginDtoSchema = void 0;
// src/dtos/auth.dto.ts
const zod_1 = require("zod");
exports.LoginDtoSchema = zod_1.z.object({
    correo: zod_1.z.string().email({ message: "El correo debe ser un email válido" }),
    password: zod_1.z
        .string()
        .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});
exports.PasswordRecoveryDtoSchema = zod_1.z.object({
    correo: zod_1.z.string().email({ message: "El correo debe ser un email válido" }),
});
exports.ResetPasswordDtoSchema = zod_1.z.object({
    token: zod_1.z.string().nonempty({ message: "El token es requerido" }),
    newPassword: zod_1.z
        .string()
        .min(6, {
        message: "La nueva contraseña debe tener al menos 6 caracteres",
    }),
});
