// src/routes/group.routes.ts
import { Router } from 'express';
import { GroupController } from '../controllers/group.controller';
import { validate } from '../middlewares/validate.middleware';
import { CreateGroupDtoSchema, UpdateGroupDtoSchema } from '../dtos/group.dto';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const groupController = new GroupController();

/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: Endpoints para la gestión de grupos
 */

/**
 * @swagger
 * /api/groups:
 *   post:
 *     summary: Crea un nuevo grupo para el usuario autenticado.
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Datos del grupo a crear.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateGroupDto'
 *     responses:
 *       201:
 *         description: Grupo creado exitosamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autorizado.
 */
router.post('/', authenticate, validate(CreateGroupDtoSchema), (req, res, next) => {
  groupController.createGroup(req, res, next);
});

/**
 * @swagger
 * /api/groups/{id}:
 *   put:
 *     summary: Actualiza la información de un grupo.
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del grupo a actualizar.
 *     requestBody:
 *       required: true
 *       description: Datos actualizados del grupo.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateGroupDto'
 *     responses:
 *       200:
 *         description: Grupo actualizado exitosamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autorizado.
 */
router.put('/:id', authenticate, validate(UpdateGroupDtoSchema), (req, res, next) => {
  groupController.updateGroup(req, res, next);
});

/**
 * @swagger
 * /api/groups:
 *   get:
 *     summary: Obtiene los grupos asociados al usuario autenticado.
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de grupos del usuario.
 *       401:
 *         description: No autorizado.
 */
router.get('/', authenticate, (req, res, next) => {
  groupController.getGroups(req, res, next);
});

export default router;
