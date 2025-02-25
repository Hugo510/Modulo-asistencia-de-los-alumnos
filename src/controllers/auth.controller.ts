// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { LoginDto } from "../dtos/auth.dto";

const authService = new AuthService();

export class AuthController {
  // Maneja el inicio de sesión y retorna un token JWT en caso de éxito
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: LoginDto = req.body;
      const result = await authService.login(data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Métodos adicionales para recuperación y reinicio de contraseña se pueden agregar aquí
}
