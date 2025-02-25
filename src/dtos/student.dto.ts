// src/dtos/student.dto.ts
import { z } from "zod";

export const CreateStudentDtoSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre del alumno es requerido" }),
  apellido: z
    .string()
    .min(1, { message: "El apellido del alumno es requerido" }),
  correo: z
    .string()
    .email({ message: "El correo debe ser un email válido" })
    .optional(),
});

export type CreateStudentDto = z.infer<typeof CreateStudentDtoSchema>;

export const UpdateStudentDtoSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: "El nombre del alumno es requerido" })
    .optional(),
  apellido: z
    .string()
    .min(1, { message: "El apellido del alumno es requerido" })
    .optional(),
  correo: z
    .string()
    .email({ message: "El correo debe ser un email válido" })
    .optional(),
});

export type UpdateStudentDto = z.infer<typeof UpdateStudentDtoSchema>;
