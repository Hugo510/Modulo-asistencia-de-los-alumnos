"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/student.routes.ts
const express_1 = require("express");
const student_controller_1 = require("../controllers/student.controller");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const student_dto_1 = require("../dtos/student.dto");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const studentController = new student_controller_1.StudentController();
/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Endpoints para la gestión de alumnos
 */
/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Obtiene la lista de todos los alumnos.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de alumnos.
 *       401:
 *         description: No autorizado.
 */
router.get("/", auth_middleware_1.authenticate, (req, res, next) => {
    studentController.getAllStudents(req, res, next);
});
/**
 * @swagger
 * /api/students/groups/{groupId}/students:
 *   post:
 *     summary: Crea un alumno y lo asocia a un grupo.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del grupo al que se asociará el alumno.
 *     requestBody:
 *       required: true
 *       description: Datos del alumno a crear.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStudentDto'
 *     responses:
 *       201:
 *         description: Alumno creado y asociado al grupo exitosamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autorizado.
 */
router.post("/groups/:groupId/students", auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(student_dto_1.CreateStudentDtoSchema), (req, res, next) => {
    studentController.createStudent(req, res, next);
});
/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Actualiza la información de un alumno.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del alumno a actualizar.
 *     requestBody:
 *       required: true
 *       description: Datos actualizados del alumno.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStudentDto'
 *     responses:
 *       200:
 *         description: Alumno actualizado exitosamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Alumno no encontrado.
 */
router.put("/:id", auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(student_dto_1.UpdateStudentDtoSchema), (req, res, next) => {
    studentController.updateStudent(req, res, next);
});
/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Obtiene la información de un alumno por su ID.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del alumno.
 *     responses:
 *       200:
 *         description: Datos del alumno.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Alumno no encontrado.
 */
router.get("/:id", auth_middleware_1.authenticate, (req, res, next) => {
    studentController.getStudent(req, res, next);
});
exports.default = router;
