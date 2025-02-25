// src/routes/attendance.routes.ts
import { Router } from "express";
import { AttendanceController } from "../controllers/attendance.controller";
import { validate } from "../middlewares/validate.middleware";
import { CreateAttendanceDtoSchema } from "../dtos/attendance.dto";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();
const attendanceController = new AttendanceController();

// Registrar la asistencia de un alumno (requiere autenticación)
router.post(
  "/",
  authenticate,
  validate(CreateAttendanceDtoSchema),
  (req, res, next) => {
    attendanceController.createAttendance(req, res, next);
  }
);

export default router;
