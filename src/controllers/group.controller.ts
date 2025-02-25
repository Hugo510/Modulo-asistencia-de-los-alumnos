// src/controllers/group.controller.ts
import { Request, Response, NextFunction } from "express";
import { GroupService } from "../services/group.service";
import { CreateGroupDto, UpdateGroupDto } from "../dtos/group.dto";

declare global {
  namespace Express {
    interface Request {
      user?: { id: number };
    }
  }
}

const groupService = new GroupService();

export class GroupController {
  // Crea un nuevo grupo asignándolo al usuario autenticado
  async createGroup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Se asume que el middleware de autenticación añade 'user' a la solicitud
      const userId = req.user?.id;
      if (!userId) {
        throw { status: 401, message: "Usuario no autenticado" };
      }
      const data: CreateGroupDto = req.body;
      const group = await groupService.createGroup(userId, data);
      res.status(201).json(group);
    } catch (error) {
      next(error);
    }
  }

  // Actualiza un grupo existente
  async updateGroup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const groupId = parseInt(req.params.id, 10);
      const data: UpdateGroupDto = req.body;
      const group = await groupService.updateGroup(groupId, data);
      res.status(200).json(group);
    } catch (error) {
      next(error);
    }
  }

  // Obtiene todos los grupos asociados al usuario autenticado
  async getGroups(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw { status: 401, message: "Usuario no autenticado" };
      }
      const groups = await groupService.getGroupsByUser(userId);
      res.status(200).json(groups);
    } catch (error) {
      next(error);
    }
  }
}
