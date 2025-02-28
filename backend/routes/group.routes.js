"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/group.routes.ts
const express_1 = require("express");
const group_controller_1 = require("../controllers/group.controller");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const group_dto_1 = require("../dtos/group.dto");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const groupController = new group_controller_1.GroupController();
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
router.post('/', auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(group_dto_1.CreateGroupDtoSchema), (req, res, next) => {
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
router.put('/:id', auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(group_dto_1.UpdateGroupDtoSchema), (req, res, next) => {
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
router.get('/', auth_middleware_1.authenticate, (req, res, next) => {
    groupController.getGroups(req, res, next);
});
exports.default = router;
