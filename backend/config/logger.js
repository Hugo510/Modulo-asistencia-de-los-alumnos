"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/config/logger.ts
const winston_1 = __importDefault(require("winston"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const env_1 = require("./env"); // Importamos las variables de entorno
// Directorio para almacenar los logs
const logDir = path_1.default.resolve("logs");
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir);
}
const logger = winston_1.default.createLogger({
    level: "info",
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.json()),
    transports: [
        // Transporte para consola
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple()),
        }),
        // Archivo para errores críticos
        new winston_1.default.transports.File({
            filename: path_1.default.join(logDir, "error.log"),
            level: "error",
        }),
        // Archivo para logs generales
        new winston_1.default.transports.File({
            filename: path_1.default.join(logDir, "combined.log"),
        }),
    ],
});
// Mensaje adicional en desarrollo
if (env_1.env.NODE_ENV !== "production") {
    logger.debug("Logging inicializado en modo debug");
}
exports.default = logger;
