// src/routes/user.routes.ts
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validate } from '../middlewares/validate.middleware';
import { CreateUserDtoSchema, UpdateUserDtoSchema } from '../dtos/user.dto';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const userController = new UserController();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints para la gestión de usuarios
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crea un nuevo usuario.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       description: Datos para crear el usuario.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserDto'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente.
 *       400:
 *         description: Datos inválidos.
 */
router.post('/', validate(CreateUserDtoSchema), (req, res, next) => {
  userController.createUser(req, res, next);
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualiza un usuario existente.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario a actualizar.
 *     requestBody:
 *       required: true
 *       description: Datos actualizados del usuario.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserDto'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Usuario no encontrado.
 */
router.put('/:id', authenticate, validate(UpdateUserDtoSchema), (req, res, next) => {
  userController.updateUser(req, res, next);
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtiene los datos de un usuario por su ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario a consultar.
 *     responses:
 *       200:
 *         description: Usuario encontrado.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Usuario no encontrado.
 */
router.get('/:id', authenticate, (req, res, next) => {
  userController.getUser(req, res, next);
});

export default router;
