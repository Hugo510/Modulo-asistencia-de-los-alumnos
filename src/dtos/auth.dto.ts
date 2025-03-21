// src/dtos/auth.dto.ts
import { z } from "zod";

export const LoginDtoSchema = z.object({
  correo: z.string().email({ message: "El correo debe ser un email válido" }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

export type LoginDto = z.infer<typeof LoginDtoSchema>;

export const PasswordRecoveryDtoSchema = z.object({
  correo: z.string().email({ message: "El correo debe ser un email válido" }),
});

export type PasswordRecoveryDto = z.infer<typeof PasswordRecoveryDtoSchema>;

export const ResetPasswordDtoSchema = z.object({
  token: z.string().nonempty({ message: "El token es requerido" }),
  newPassword: z.string().min(6, {
    message: "La nueva contraseña debe tener al menos 6 caracteres",
  }),
});

export type ResetPasswordDto = z.infer<typeof ResetPasswordDtoSchema>;

// para registrar un usuario nuevo
export const RegisterDtoSchema = z.object({
  nombre: z.string().nonempty({ message: "El nombre es requerido" }),
  correo: z.string().email({ message: "El correo debe ser un email válido" }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  rol: z.string().nonempty({ message: "El rol es requerido" }),
});

export type RegisterDto = z.infer<typeof RegisterDtoSchema>;
