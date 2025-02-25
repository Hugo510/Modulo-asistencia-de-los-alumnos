// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Registra el error con Winston, incluyendo el stack para depuración
  logger.error(`Error: ${err.message}`, { stack: err.stack });

  // Define el código de estado (500 por defecto)
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: err.message || "Error interno del servidor",
  });
};

export default errorHandler;
