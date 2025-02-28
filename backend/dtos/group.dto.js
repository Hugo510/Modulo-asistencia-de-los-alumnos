"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGroupDtoSchema = exports.CreateGroupDtoSchema = void 0;
// src/dtos/group.dto.ts
const zod_1 = require("zod");
exports.CreateGroupDtoSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(1, { message: "El nombre del grupo es requerido" }),
});
exports.UpdateGroupDtoSchema = zod_1.z.object({
    nombre: zod_1.z
        .string()
        .min(1, { message: "El nombre del grupo es requerido" })
        .optional(),
});
