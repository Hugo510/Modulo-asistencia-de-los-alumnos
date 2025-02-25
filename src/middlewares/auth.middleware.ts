// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthenticatedRequest extends Request {
  user?: any; // Puedes definir un tipo más específico para el payload si lo deseas
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void | Response => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ error: "No se encontró el token de autenticación" });
  }

  // Se asume que el token viene en el formato "Bearer <token>"
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};
