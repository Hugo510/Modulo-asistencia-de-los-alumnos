// src/services/student.service.ts
import prisma from "../config/db";
import { CreateStudentDto, UpdateStudentDto } from "../dtos/student.dto";

export class StudentService {
  // Crea un nuevo alumno y lo asocia a un grupo.
  async createStudent(groupId: number, data: CreateStudentDto) {
    // Se crea el alumno
    const student = await prisma.alumno.create({
      data,
    });
    // Se asocia el alumno al grupo mediante la tabla intermedia
    await prisma.grupoAlumno.create({
      data: {
        idGrupo: groupId,
        idAlumno: student.id,
      },
    });
    return student;
  }

  // Actualiza los datos de un alumno.
  async updateStudent(studentId: number, data: UpdateStudentDto) {
    const updatedStudent = await prisma.alumno.update({
      where: { id: studentId },
      data,
    });
    return updatedStudent;
  }

  // Consulta un alumno por su ID.
  async getStudentById(studentId: number) {
    const student = await prisma.alumno.findUnique({
      where: { id: studentId },
    });
    if (!student) {
      throw { status: 404, message: "Alumno no encontrado" };
    }
    return student;
  }
}
