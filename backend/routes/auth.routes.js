"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.routes.ts
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const auth_dto_1 = require("../dtos/auth.dto");
const captcha_middleware_1 = require("../middlewares/captcha.middleware");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
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
router.post("/login", (0, validate_middleware_1.validate)(auth_dto_1.LoginDtoSchema), captcha_middleware_1.verifyCaptcha, (req, res, next) => {
    authController.login(req, res, next);
});
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
router.post("/recover", (0, validate_middleware_1.validate)(auth_dto_1.PasswordRecoveryDtoSchema), (req, res, next) => {
    authController.recoverPassword(req, res, next);
});
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
router.post("/reset", (0, validate_middleware_1.validate)(auth_dto_1.ResetPasswordDtoSchema), (req, res, next) => {
    authController.resetPassword(req, res, next);
});
exports.default = router;
