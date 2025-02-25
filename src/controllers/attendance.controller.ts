// src/controllers/attendance.controller.ts
import { Request, Response, NextFunction } from "express";
import { AttendanceService } from "../services/attendance.service";
import { CreateAttendanceDto } from "../dtos/attendance.dto";

const attendanceService = new AttendanceService();

export class AttendanceController {
  // Registra la asistencia de un alumno en una fecha dada
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
}
