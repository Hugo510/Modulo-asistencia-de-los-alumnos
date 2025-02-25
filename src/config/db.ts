// src/config/db.ts
import { PrismaClient } from "@prisma/client";
import { env } from "./env"; // Aseguramos la validación de las variables

// Inicialización del cliente de Prisma con logs para facilitar la depuración
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

export default prisma;
