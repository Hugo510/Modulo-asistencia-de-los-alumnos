// src/services/attendance.service.ts
import prisma from "../config/db";
import { CreateAttendanceDto } from "../dtos/attendance.dto";

export class AttendanceService {
  // Registra la asistencia de un alumno en una fecha dada.
  async createAttendance(data: CreateAttendanceDto) {
    const attendance = await prisma.asistencia.create({
      data: {
        idAlumno: data.idAlumno,
        fecha: data.fecha,
        estado: data.estado,
      },
    });
    return attendance;
  }

  // Métodos adicionales para consultar, actualizar o eliminar registros de asistencia se pueden agregar aquí.
}
