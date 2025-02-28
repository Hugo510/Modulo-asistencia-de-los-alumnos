"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStudentDtoSchema = exports.CreateStudentDtoSchema = void 0;
// src/dtos/student.dto.ts
const zod_1 = require("zod");
exports.CreateStudentDtoSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(1, { message: "El nombre del alumno es requerido" }),
    apellido: zod_1.z
        .string()
        .min(1, { message: "El apellido del alumno es requerido" }),
    correo: zod_1.z
        .string()
        .email({ message: "El correo debe ser un email válido" })
        .optional(),
});
exports.UpdateStudentDtoSchema = zod_1.z.object({
    nombre: zod_1.z
        .string()
        .min(1, { message: "El nombre del alumno es requerido" })
        .optional(),
    apellido: zod_1.z
        .string()
        .min(1, { message: "El apellido del alumno es requerido" })
        .optional(),
    correo: zod_1.z
        .string()
        .email({ message: "El correo debe ser un email válido" })
        .optional(),
});
