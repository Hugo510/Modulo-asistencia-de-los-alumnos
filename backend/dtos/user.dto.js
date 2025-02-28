"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserDtoSchema = exports.CreateUserDtoSchema = void 0;
// src/dtos/user.dto.ts
const zod_1 = require("zod");
exports.CreateUserDtoSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(1, { message: "El nombre es requerido" }),
    correo: zod_1.z.string().email({ message: "El correo debe ser un email válido" }),
    password: zod_1.z
        .string()
        .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
    rol: zod_1.z.enum(["profesor", "administrador"]).optional(),
});
exports.UpdateUserDtoSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(1, { message: "El nombre es requerido" }).optional(),
    correo: zod_1.z
        .string()
        .email({ message: "El correo debe ser un email válido" })
        .optional(),
    password: zod_1.z
        .string()
        .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
        .optional(),
    rol: zod_1.z.enum(["profesor", "administrador"]).optional(),
});
