"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/services/email.service.ts
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const logger_1 = __importDefault(require("../config/logger"));
class EmailService {
    constructor() {
        this.transporter = null;
        if (env_1.env.NODE_ENV === "development") {
            // En desarrollo, se utiliza Ethereal para simular el envío de correos
            nodemailer_1.default
                .createTestAccount()
                .then((testAccount) => {
                this.transporter = nodemailer_1.default.createTransport({
                    host: testAccount.smtp.host,
                    port: testAccount.smtp.port,
                    secure: testAccount.smtp.secure, // true para 465, false para otros puertos
                    auth: {
                        user: testAccount.user,
                        pass: testAccount.pass,
                    },
                });
                logger_1.default.info("Transportador Ethereal configurado correctamente.");
            })
                .catch((error) => {
                logger_1.default.error("Error al crear la cuenta de prueba Ethereal", error);
            });
        }
        else {
            // En producción se usarían las variables de entorno definidas
            this.transporter = nodemailer_1.default.createTransport({
                host: env_1.env.EMAIL_HOST,
                port: env_1.env.EMAIL_PORT,
                secure: env_1.env.EMAIL_PORT === 465, // true para puerto 465, false para otros
                auth: {
                    user: env_1.env.EMAIL_USER,
                    pass: env_1.env.EMAIL_PASS,
                },
            });
        }
    }
    /**
     * Envía un correo de recuperación con un enlace que incluye el token.
     * @param to Dirección de correo destino.
     * @param token Token de reinicio de contraseña.
     */
    sendRecoveryEmail(to, token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.transporter) {
                throw new Error("El transportador de email no está configurado");
            }
            const resetUrl = `${env_1.env.FRONTEND_URL}reset-password?token=${token}`;
            const mailOptions = {
                from: env_1.env.EMAIL_FROM,
                to,
                subject: "Recuperación de contraseña",
                text: `Has solicitado recuperar tu contraseña. Utiliza el siguiente enlace para reiniciarla: ${resetUrl}`,
                html: `<p>Has solicitado recuperar tu contraseña.</p>
             <p>Haz clic <a href="${resetUrl}">aquí</a> para reiniciarla.</p>`,
            };
            try {
                const info = yield this.transporter.sendMail(mailOptions);
                logger_1.default.info(`Correo de recuperación enviado: ${info.messageId}`);
                // Si se usa Ethereal, se muestra la URL de vista previa del mensaje
                if (env_1.env.NODE_ENV === "development") {
                    const previewUrl = nodemailer_1.default.getTestMessageUrl(info);
                    logger_1.default.info(`Vista previa del correo: ${previewUrl}`);
                }
            }
            catch (error) {
                logger_1.default.error("Error al enviar el correo de recuperación", error);
                throw new Error("No se pudo enviar el correo de recuperación");
            }
        });
    }
}
exports.default = new EmailService();
