"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/user.routes.ts
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const user_dto_1 = require("../dtos/user.dto");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const userController = new user_controller_1.UserController();
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
router.post('/', (0, validate_middleware_1.validate)(user_dto_1.CreateUserDtoSchema), (req, res, next) => {
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
router.put('/:id', auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(user_dto_1.UpdateUserDtoSchema), (req, res, next) => {
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
router.get('/:id', auth_middleware_1.authenticate, (req, res, next) => {
    userController.getUser(req, res, next);
});
exports.default = router;
