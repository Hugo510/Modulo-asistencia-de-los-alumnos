// src/config/logger.ts
import winston from "winston";
import fs from "fs";
import path from "path";
import { env } from "./env"; // Importamos las variables de entorno

// Directorio para almacenar los logs
const logDir = path.resolve("logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.json()
  ),
  transports: [
    // Transporte para consola
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    // Archivo para errores críticos
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
    // Archivo para logs generales
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }),
  ],
});

// Mensaje adicional en desarrollo
if (env.NODE_ENV !== "production") {
  logger.debug("Logging inicializado en modo debug");
}

export default logger;
