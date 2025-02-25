// src/routes/student.routes.ts
import { Router } from "express";
import { StudentController } from "../controllers/student.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  CreateStudentDtoSchema,
  UpdateStudentDtoSchema,
} from "../dtos/student.dto";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();
const studentController = new StudentController();

// Crear un alumno y asociarlo a un grupo (se espera que el ID del grupo esté en los parámetros)
router.post(
  "/groups/:groupId/students",
  authenticate,
  validate(CreateStudentDtoSchema),
  (req, res, next) => {
    studentController.createStudent(req, res, next);
  }
);

// Actualizar un alumno existente (requiere autenticación)
router.put(
  "/:id",
  authenticate,
  validate(UpdateStudentDtoSchema),
  (req, res, next) => {
    studentController.updateStudent(req, res, next);
  }
);

// Obtener los datos de un alumno por ID (requiere autenticación)
router.get("/:id", authenticate, (req, res, next) => {
  studentController.getStudent(req, res, next);
});

export default router;
