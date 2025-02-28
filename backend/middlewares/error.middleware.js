"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../config/logger"));
const errorHandler = (err, req, res, next) => {
    // Registra el error con Winston, incluyendo el stack para depuración
    logger_1.default.error(`Error: ${err.message}`, { stack: err.stack });
    // Define el código de estado (500 por defecto)
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        error: err.message || "Error interno del servidor",
    });
};
exports.default = errorHandler;
