// src/dtos/user.dto.ts
import { z } from "zod";

export const CreateUserDtoSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre es requerido" }),
  correo: z.string().email({ message: "El correo debe ser un email válido" }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  rol: z.enum(["profesor", "administrador"]).optional(),
});

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;

export const UpdateUserDtoSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre es requerido" }).optional(),
  correo: z
    .string()
    .email({ message: "El correo debe ser un email válido" })
    .optional(),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
    .optional(),
  rol: z.enum(["profesor", "administrador"]).optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>;
