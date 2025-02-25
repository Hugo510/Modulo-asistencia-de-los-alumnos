// src/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { LoginDtoSchema } from '../dtos/auth.dto';

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticación
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión y retorna un token JWT.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       description: Datos para autenticación.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDto'
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso. Retorna el token de autenticación.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: Credenciales incorrectas.
 */
router.post('/login', validate(LoginDtoSchema), (req, res, next) => {
  authController.login(req, res, next);
});

export default router;
