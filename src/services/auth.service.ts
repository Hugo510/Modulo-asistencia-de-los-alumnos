// src/services/auth.service.ts
import prisma from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { LoginDto } from "../dtos/auth.dto";

export class AuthService {
  // Autentica al usuario y genera un token JWT si las credenciales son válidas.
  async login(data: LoginDto) {
    const { correo, password } = data;
    const user = await prisma.usuario.findUnique({ where: { correo } });
    if (!user) {
      throw { status: 401, message: "Credenciales inválidas" };
    }
    // Comparación segura de contraseñas con bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw { status: 401, message: "Credenciales inválidas" };
    }
    // Generación del token JWT con datos esenciales del usuario
    const token = jwt.sign(
      { id: user.id, correo: user.correo, rol: user.rol },
      env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return { token };
  }

  // Métodos adicionales para recuperación y reinicio de contraseña se pueden agregar aquí
}
