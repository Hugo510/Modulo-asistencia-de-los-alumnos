// src/services/group.service.ts
import prisma from "../config/db";
import { CreateGroupDto, UpdateGroupDto } from "../dtos/group.dto";

export class GroupService {
  // Crea un nuevo grupo y lo asigna al usuario autenticado.
  async createGroup(userId: number, data: CreateGroupDto) {
    const newGroup = await prisma.grupo.create({
      data: {
        ...data,
        idUsuario: userId,
      },
    });
    return newGroup;
  }

  // Actualiza la información de un grupo existente.
  async updateGroup(groupId: number, data: UpdateGroupDto) {
    const updatedGroup = await prisma.grupo.update({
      where: { id: groupId },
      data,
    });
    return updatedGroup;
  }

  // Obtiene todos los grupos asociados a un usuario.
  async getGroupsByUser(userId: number) {
    const groups = await prisma.grupo.findMany({
      where: { idUsuario: userId },
    });
    return groups;
  }
}
