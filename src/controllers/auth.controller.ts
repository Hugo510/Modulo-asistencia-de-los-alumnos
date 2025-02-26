// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import {
  LoginDto,
  PasswordRecoveryDto,
  ResetPasswordDto,
} from "../dtos/auth.dto";

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: LoginDto = req.body;
      const result = await authService.login(data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async recoverPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data: PasswordRecoveryDto = req.body;
      const result = await authService.recoverPassword(data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data: ResetPasswordDto = req.body;
      const result = await authService.resetPassword(data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
