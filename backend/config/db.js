"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/config/db.ts
const client_1 = require("@prisma/client");
// Inicialización del cliente de Prisma con logs para facilitar la depuración
const prisma = new client_1.PrismaClient({
    log: ["query", "info", "warn", "error"],
});
exports.default = prisma;
