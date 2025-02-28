// src/controllers/attendance.controller.ts
import { Request, Response, NextFunction } from "express";
import { AttendanceService } from "../services/attendance.service";
import { CreateAttendanceDto } from "../dtos/attendance.dto";
import { UpdateAttendanceDto } from "../dtos/attendance.dto";

const attendanceService = new AttendanceService();

export class AttendanceController {
  // Método para crear un registro de asistencia (ya implementado)
  async createAttendance(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data: CreateAttendanceDto = req.body;
      const attendance = await attendanceService.createAttendance(data);
      res.status(201).json(attendance);
    } catch (error) {
      next(error);
    }
  }

  // Consulta un registro de asistencia por ID
  async getAttendance(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const attendanceId = parseInt(req.params.id, 10);
      const attendance = await attendanceService.getAttendanceById(
        attendanceId
      );
      res.status(200).json(attendance);
    } catch (error) {
      next(error);
    }
  }

  // Obtiene todos los registros de asistencia
  async getAllAttendances(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const attendances = await attendanceService.getAllAttendances();
      res.status(200).json(attendances);
    } catch (error) {
      next(error);
    }
  }

  // Actualiza un registro de asistencia por ID
  async updateAttendance(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const attendanceId = parseInt(req.params.id, 10);
      const data: UpdateAttendanceDto = req.body;
      const attendance = await attendanceService.updateAttendance(
        attendanceId,
        data
      );
      res.status(200).json(attendance);
    } catch (error) {
      next(error);
    }
  }

  // Elimina un registro de asistencia por ID
  async deleteAttendance(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const attendanceId = parseInt(req.params.id, 10);
      const attendance = await attendanceService.deleteAttendance(attendanceId);
      res.status(200).json(attendance);
    } catch (error) {
      next(error);
    }
  }
}
