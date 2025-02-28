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
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCaptcha = void 0;
const env_1 = require("../config/env");
// Este middleware asume que el token CAPTCHA se envía en el body bajo la propiedad 'captchaToken'
const verifyCaptcha = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const captchaToken = req.body.captchaToken;
    if (!captchaToken) {
        res.status(400).json({ error: "Token CAPTCHA no proporcionado" });
        return;
    }
    // Para desarrollo: se puede simular la verificación aceptando un token fijo
    if (env_1.env.NODE_ENV === "development" && captchaToken === "test-captcha") {
        return next();
    }
    try {
        // Construir la URL de verificación usando la clave secreta y el token recibido
        const secret = env_1.env.RECAPTCHA_SECRET_KEY;
        const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${captchaToken}`;
        // Enviar la petición POST a la API de reCAPTCHA
        const response = yield fetch(verificationUrl, { method: "POST" });
        const data = yield response.json();
        if (data.success) {
            return next();
        }
        else {
            res.status(400).json({ error: "Token CAPTCHA inválido" });
            return;
        }
    }
    catch (error) {
        console.error("Error al verificar CAPTCHA", error);
        res.status(500).json({ error: "Error al verificar CAPTCHA" });
        return;
    }
});
exports.verifyCaptcha = verifyCaptcha;
