// src/dtos/auth.dto.ts
import { z } from "zod";

// Definición del esquema para el login
export const LoginDtoSchema = z.object({
  correo: z.string().email({ message: "El correo debe ser un email válido" }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

// Tipo inferido del DTO a partir del esquema
export type LoginDto = z.infer<typeof LoginDtoSchema>;
