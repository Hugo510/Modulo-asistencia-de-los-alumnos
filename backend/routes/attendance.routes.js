"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/attendance.routes.ts
const express_1 = require("express");
const attendance_controller_1 = require("../controllers/attendance.controller");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const attendance_dto_1 = require("../dtos/attendance.dto");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const attendanceController = new attendance_controller_1.AttendanceController();
/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Endpoints para el registro y gestión de asistencia
 */
/**
 * @swagger
 * /api/attendance:
 *   get:
 *     summary: Obtiene todos los registros de asistencia.
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de registros de asistencia.
 *       401:
 *         description: No autorizado.
 */
router.get("/", auth_middleware_1.authenticate, (req, res, next) => {
    attendanceController.getAllAttendances(req, res, next);
});
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
 *       description: Datos para registrar la asistencia.
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
router.post("/", auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(attendance_dto_1.CreateAttendanceDtoSchema), (req, res, next) => {
    attendanceController.createAttendance(req, res, next);
});
/**
 * @swagger
 * /api/attendance/{id}:
 *   get:
 *     summary: Obtiene un registro de asistencia por su ID.
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de asistencia.
 *     responses:
 *       200:
 *         description: Registro de asistencia obtenido.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Registro de asistencia no encontrado.
 */
router.get("/:id", auth_middleware_1.authenticate, (req, res, next) => {
    attendanceController.getAttendance(req, res, next);
});
/**
 * @swagger
 * /api/attendance/{id}:
 *   put:
 *     summary: Actualiza un registro de asistencia por su ID.
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de asistencia a actualizar.
 *     requestBody:
 *       required: true
 *       description: Datos actualizados del registro de asistencia.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAttendanceDto'
 *     responses:
 *       200:
 *         description: Registro de asistencia actualizado exitosamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Registro de asistencia no encontrado.
 */
router.put("/:id", auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(attendance_dto_1.UpdateAttendanceDtoSchema), (req, res, next) => {
    attendanceController.updateAttendance(req, res, next);
});
/**
 * @swagger
 * /api/attendance/{id}:
 *   delete:
 *     summary: Elimina un registro de asistencia por su ID.
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de asistencia a eliminar.
 *     responses:
 *       200:
 *         description: Registro de asistencia eliminado exitosamente.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Registro de asistencia no encontrado.
 */
router.delete("/:id", auth_middleware_1.authenticate, (req, res, next) => {
    attendanceController.deleteAttendance(req, res, next);
});
exports.default = router;
