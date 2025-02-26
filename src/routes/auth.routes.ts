// src/routes/auth.routes.ts
import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  LoginDtoSchema,
  PasswordRecoveryDtoSchema,
  ResetPasswordDtoSchema,
} from "../dtos/auth.dto";
import { verifyCaptcha } from "../middlewares/captcha.middleware";

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
 *       description: Datos para autenticación, incluyendo el token CAPTCHA.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               captchaToken:
 *                 type: string
 *             required:
 *               - correo
 *               - password
 *               - captchaToken
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso. Retorna el token de autenticación.
 *       400:
 *         description: Datos inválidos o token CAPTCHA no válido.
 *       401:
 *         description: Credenciales incorrectas.
 */
router.post(
  "/login",
  validate(LoginDtoSchema),
  verifyCaptcha,
  (req, res, next) => {
    authController.login(req, res, next);
  }
);

/**
 * @swagger
 * /api/auth/recover:
 *   post:
 *     summary: Solicita la recuperación de contraseña.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       description: Correo asociado a la cuenta para enviar el token de reinicio.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PasswordRecoveryDto'
 *     responses:
 *       200:
 *         description: Mensaje indicando que se ha enviado el correo de recuperación.
 *       400:
 *         description: Datos inválidos.
 */
router.post(
  "/recover",
  validate(PasswordRecoveryDtoSchema),
  (req, res, next) => {
    authController.recoverPassword(req, res, next);
  }
);

/**
 * @swagger
 * /api/auth/reset:
 *   post:
 *     summary: Reinicia la contraseña utilizando un token de reinicio.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       description: Token de reinicio y la nueva contraseña.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordDto'
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: Token inválido o expirado.
 */
router.post("/reset", validate(ResetPasswordDtoSchema), (req, res, next) => {
  authController.resetPassword(req, res, next);
});

export default router;
