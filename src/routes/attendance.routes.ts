// src/routes/attendance.routes.ts
import { Router } from 'express';
import { AttendanceController } from '../controllers/attendance.controller';
import { validate } from '../middlewares/validate.middleware';
import { CreateAttendanceDtoSchema } from '../dtos/attendance.dto';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const attendanceController = new AttendanceController();

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Endpoints para el registro de asistencia
 */

/**
 * @swagger
 * /api/attendance:
 *   post:
 *     summary: Registra la asistencia de un alumno.
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Datos de la asistencia a registrar.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAttendanceDto'
 *     responses:
 *       201:
 *         description: Asistencia registrada exitosamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autorizado.
 */
router.post('/', authenticate, validate(CreateAttendanceDtoSchema), (req, res, next) => {
  attendanceController.createAttendance(req, res, next);
});

export default router;
