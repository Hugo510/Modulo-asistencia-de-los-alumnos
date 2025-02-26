// src/controllers/student.controller.ts
import { Request, Response, NextFunction } from "express";
import { StudentService } from "../services/student.service";
import { CreateStudentDto, UpdateStudentDto } from "../dtos/student.dto";

const studentService = new StudentService();

export class StudentController {
  // Crea un alumno y lo asocia a un grupo (se espera que el ID del grupo venga en los parámetros)
  async createStudent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const groupId = parseInt(req.params.groupId, 10);
      const data: CreateStudentDto = req.body;
      const student = await studentService.createStudent(groupId, data);
      res.status(201).json(student);
    } catch (error) {
      next(error);
    }
  }

  // Actualiza los datos de un alumno existente
  async updateStudent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const studentId = parseInt(req.params.id, 10);
      const data: UpdateStudentDto = req.body;
      const student = await studentService.updateStudent(studentId, data);
      res.status(200).json(student);
    } catch (error) {
      next(error);
    }
  }

  // Consulta un alumno por su ID
  async getStudent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const studentId = parseInt(req.params.id, 10);
      const student = await studentService.getStudentById(studentId);
      res.status(200).json(student);
    } catch (error) {
      next(error);
    }
  }

  // Obtiene todos los alumnos
  async getAllStudents(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const students = await studentService.getAllStudents();
      res.status(200).json(students);
    } catch (error) {
      next(error);
    }
  }
}
