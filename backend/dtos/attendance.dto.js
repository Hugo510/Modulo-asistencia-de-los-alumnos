"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAttendanceDtoSchema = exports.CreateAttendanceDtoSchema = void 0;
// src/dtos/attendance.dto.ts
const zod_1 = require("zod");
exports.CreateAttendanceDtoSchema = zod_1.z.object({
    idAlumno: zod_1.z.number({
        required_error: "El identificador del alumno es requerido",
    }),
    fecha: zod_1.z.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date)
            return new Date(arg);
    }, zod_1.z.date({ required_error: "La fecha es requerida" })),
    estado: zod_1.z.enum(["presente", "ausente", "tardanza"], {
        errorMap: () => ({
            message: "El estado debe ser 'presente', 'ausente' o 'tardanza'",
        }),
    }),
});
exports.UpdateAttendanceDtoSchema = zod_1.z.object({
    // Permite actualizar la fecha y/o el estado; ambos son opcionales.
    fecha: zod_1.z
        .preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date)
            return new Date(arg);
    }, zod_1.z.date().optional())
        .optional(),
    estado: zod_1.z
        .enum(["presente", "ausente", "tardanza"], {
        errorMap: () => ({
            message: "El estado debe ser 'presente', 'ausente' o 'tardanza'",
        }),
    })
        .optional(),
});
