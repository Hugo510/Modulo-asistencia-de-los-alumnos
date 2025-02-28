// src/services/attendance.service.ts
import prisma from "../config/db";
import { CreateAttendanceDto } from "../dtos/attendance.dto";
import { UpdateAttendanceDto } from "../dtos/attendance.dto";

export class AttendanceService {
  // Método ya implementado para crear asistencia
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

  // Consulta un registro de asistencia por su ID
  async getAttendanceById(attendanceId: number) {
    const attendance = await prisma.asistencia.findUnique({
      where: { id: attendanceId },
    });
    if (!attendance) {
      throw { status: 404, message: "Registro de asistencia no encontrado" };
    }
    return attendance;
  }

  // Obtiene todos los registros de asistencia
  async getAllAttendances() {
    const attendances = await prisma.asistencia.findMany({
      include: {
        alumno: true, // Incluir los datos del alumno relacionado
      },
    });
    return attendances;
  }

  // Actualiza un registro de asistencia por su ID
  async updateAttendance(attendanceId: number, data: UpdateAttendanceDto) {
    const attendance = await prisma.asistencia.update({
      where: { id: attendanceId },
      data,
    });
    return attendance;
  }

  // Elimina un registro de asistencia por su ID
  async deleteAttendance(attendanceId: number) {
    const attendance = await prisma.asistencia.delete({
      where: { id: attendanceId },
    });
    return attendance;
  }
}
