// src/services/auth.service.ts
import prisma from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import emailService from "./email.service";
import {
  LoginDto,
  PasswordRecoveryDto,
  ResetPasswordDto,
} from "../dtos/auth.dto";

export class AuthService {
  async login(data: LoginDto) {
    const { correo, password } = data;
    const user = await prisma.usuario.findUnique({ where: { correo } });
    if (!user) {
      throw { status: 401, message: "Credenciales inválidas" };
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw { status: 401, message: "Credenciales inválidas" };
    }
    const token = jwt.sign(
      { id: user.id, correo: user.correo, rol: user.rol },
      env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return { token };
  }

  // Método para solicitar la recuperación de contraseña
  async recoverPassword(
    data: PasswordRecoveryDto
  ): Promise<{ message: string }> {
    const { correo } = data;
    const user = await prisma.usuario.findUnique({ where: { correo } });
    // Siempre se retorna el mismo mensaje para no revelar si el correo existe o no
    const genericMessage = {
      message:
        "Si existe una cuenta asociada, se ha enviado un correo de recuperación.",
    };
    if (!user) {
      return genericMessage;
    }
    // Generar un token de reinicio con expiración corta (15 minutos)
    const resetToken = jwt.sign({ id: user.id }, env.JWT_SECRET, {
      expiresIn: "15m",
    });
    // Enviar el correo de recuperación
    await emailService.sendRecoveryEmail(correo, resetToken);
    return genericMessage;
  }

  // Método para reiniciar la contraseña
  async resetPassword(data: ResetPasswordDto): Promise<{ message: string }> {
    const { token, newPassword } = data;
    let payload: any;
    try {
      payload = jwt.verify(token, env.JWT_SECRET);
    } catch (error) {
      throw { status: 401, message: "Token inválido o expirado" };
    }
    const user = await prisma.usuario.findUnique({ where: { id: payload.id } });
    if (!user) {
      throw { status: 404, message: "Usuario no encontrado" };
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.usuario.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
    return { message: "Contraseña actualizada exitosamente." };
  }
}
