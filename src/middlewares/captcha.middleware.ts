// src/middlewares/captcha.middleware.ts
import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

// Este middleware asume que el token CAPTCHA se envía en el body bajo la propiedad 'captchaToken'
export const verifyCaptcha = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const captchaToken = req.body.captchaToken;
  if (!captchaToken) {
    res.status(400).json({ error: "Token CAPTCHA no proporcionado" });
    return;
  }

  // Para desarrollo: se puede simular la verificación aceptando un token fijo
  if (env.NODE_ENV === "development" && captchaToken === "test-captcha") {
    return next();
  }

  try {
    // Construir la URL de verificación usando la clave secreta y el token recibido
    const secret = env.RECAPTCHA_SECRET_KEY;
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${captchaToken}`;

    // Enviar la petición POST a la API de reCAPTCHA
    const response = await fetch(verificationUrl, { method: "POST" });
    const data = await response.json();

    if (data.success) {
      return next();
    } else {
      res.status(400).json({ error: "Token CAPTCHA inválido" });
      return;
    }
  } catch (error) {
    console.error("Error al verificar CAPTCHA", error);
    res.status(500).json({ error: "Error al verificar CAPTCHA" });
    return;
  }
};
