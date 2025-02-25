// src/routes/student.routes.ts
import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';
import { validate } from '../middlewares/validate.middleware';
import { CreateStudentDtoSchema, UpdateStudentDtoSchema } from '../dtos/student.dto';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const studentController = new StudentController();

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Endpoints para la gestión de alumnos
 */

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
router.post('/groups/:groupId/students', authenticate, validate(CreateStudentDtoSchema), (req, res, next) => {
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
router.put('/:id', authenticate, validate(UpdateStudentDtoSchema), (req, res, next) => {
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
router.get('/:id', authenticate, (req, res, next) => {
  studentController.getStudent(req, res, next);
});

export default router;
