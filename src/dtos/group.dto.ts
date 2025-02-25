// src/dtos/group.dto.ts
import { z } from "zod";

export const CreateGroupDtoSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre del grupo es requerido" }),
});

export type CreateGroupDto = z.infer<typeof CreateGroupDtoSchema>;

export const UpdateGroupDtoSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: "El nombre del grupo es requerido" })
    .optional(),
});

export type UpdateGroupDto = z.infer<typeof UpdateGroupDtoSchema>;
