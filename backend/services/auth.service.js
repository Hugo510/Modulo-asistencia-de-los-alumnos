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
exports.AuthService = void 0;
// src/services/auth.service.ts
const db_1 = __importDefault(require("../config/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const email_service_1 = __importDefault(require("./email.service"));
class AuthService {
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { correo, password } = data;
            const user = yield db_1.default.usuario.findUnique({ where: { correo } });
            if (!user) {
                throw { status: 401, message: "Credenciales inválidas" };
            }
            const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                throw { status: 401, message: "Credenciales inválidas" };
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id, correo: user.correo, rol: user.rol }, env_1.env.JWT_SECRET, { expiresIn: "1h" });
            return { token };
        });
    }
    // Método para solicitar la recuperación de contraseña
    recoverPassword(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { correo } = data;
            const user = yield db_1.default.usuario.findUnique({ where: { correo } });
            // Siempre se retorna el mismo mensaje para no revelar si el correo existe o no
            const genericMessage = {
                message: "Si existe una cuenta asociada, se ha enviado un correo de recuperación.",
            };
            if (!user) {
                return genericMessage;
            }
            // Generar un token de reinicio con expiración corta (15 minutos)
            const resetToken = jsonwebtoken_1.default.sign({ id: user.id }, env_1.env.JWT_SECRET, {
                expiresIn: "15m",
            });
            // Enviar el correo de recuperación
            yield email_service_1.default.sendRecoveryEmail(correo, resetToken);
            return genericMessage;
        });
    }
    // Método para reiniciar la contraseña
    resetPassword(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token, newPassword } = data;
            let payload;
            try {
                payload = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
            }
            catch (error) {
                throw { status: 401, message: "Token inválido o expirado" };
            }
            const user = yield db_1.default.usuario.findUnique({ where: { id: payload.id } });
            if (!user) {
                throw { status: 404, message: "Usuario no encontrado" };
            }
            const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
            yield db_1.default.usuario.update({
                where: { id: user.id },
                data: { password: hashedPassword },
            });
            return { message: "Contraseña actualizada exitosamente." };
        });
    }
}
exports.AuthService = AuthService;
