// src/services/user.service.ts
import prisma from "../config/db";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";
import bcrypt from "bcrypt";

export class UserService {
  // Crea un nuevo usuario, aplicando hashing a la contraseña.
  async createUser(data: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await prisma.usuario.create({
      data: { ...data, password: hashedPassword },
    });
    return newUser;
  }

  // Actualiza la información de un usuario existente.
  async updateUser(id: number, data: UpdateUserDto) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const updatedUser = await prisma.usuario.update({
      where: { id },
      data,
    });
    return updatedUser;
  }

  // Obtiene un usuario por su ID.
  async getUserById(id: number) {
    const user = await prisma.usuario.findUnique({ where: { id } });
    if (!user) {
      throw { status: 404, message: "Usuario no encontrado" };
    }
    return user;
  }
}
