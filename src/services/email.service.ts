// src/services/email.service.ts
import nodemailer from "nodemailer";
import { env } from "../config/env";
import logger from "../config/logger";

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    if (env.NODE_ENV === "development") {
      // En desarrollo, se utiliza Ethereal para simular el envío de correos
      nodemailer
        .createTestAccount()
        .then((testAccount) => {
          this.transporter = nodemailer.createTransport({
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure, // true para 465, false para otros puertos
            auth: {
              user: testAccount.user,
              pass: testAccount.pass,
            },
          });
          logger.info("Transportador Ethereal configurado correctamente.");
        })
        .catch((error) => {
          logger.error("Error al crear la cuenta de prueba Ethereal", error);
        });
    } else {
      // En producción se usarían las variables de entorno definidas
      this.transporter = nodemailer.createTransport({
        host: env.EMAIL_HOST,
        port: env.EMAIL_PORT,
        secure: env.EMAIL_PORT === 465, // true para puerto 465, false para otros
        auth: {
          user: env.EMAIL_USER,
          pass: env.EMAIL_PASS,
        },
      });
    }
  }

  /**
   * Envía un correo de recuperación con un enlace que incluye el token.
   * @param to Dirección de correo destino.
   * @param token Token de reinicio de contraseña.
   */
  async sendRecoveryEmail(to: string, token: string): Promise<void> {
    if (!this.transporter) {
      throw new Error("El transportador de email no está configurado");
    }
    const resetUrl = `${env.FRONTEND_URL}/api/auth/reset?token=${token}`;
    const mailOptions = {
      from: env.EMAIL_FROM,
      to,
      subject: "Recuperación de contraseña",
      text: `Has solicitado recuperar tu contraseña. Utiliza el siguiente enlace para reiniciarla: ${resetUrl}`,
      html: `<p>Has solicitado recuperar tu contraseña.</p>
             <p>Haz clic <a href="${resetUrl}">aquí</a> para reiniciarla.</p>`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Correo de recuperación enviado: ${info.messageId}`);
      // Si se usa Ethereal, se muestra la URL de vista previa del mensaje
      if (env.NODE_ENV === "development") {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        logger.info(`Vista previa del correo: ${previewUrl}`);
      }
    } catch (error) {
      logger.error("Error al enviar el correo de recuperación", error);
      throw new Error("No se pudo enviar el correo de recuperación");
    }
  }
}

export default new EmailService();
