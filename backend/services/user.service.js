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
exports.UserService = void 0;
// src/services/user.service.ts
const db_1 = __importDefault(require("../config/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserService {
    // Crea un nuevo usuario, aplicando hashing a la contraseña.
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcrypt_1.default.hash(data.password, 10);
            const newUser = yield db_1.default.usuario.create({
                data: Object.assign(Object.assign({}, data), { password: hashedPassword }),
            });
            return newUser;
        });
    }
    // Actualiza la información de un usuario existente.
    updateUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.password) {
                data.password = yield bcrypt_1.default.hash(data.password, 10);
            }
            const updatedUser = yield db_1.default.usuario.update({
                where: { id },
                data,
            });
            return updatedUser;
        });
    }
    // Obtiene un usuario por su ID.
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.default.usuario.findUnique({ where: { id } });
            if (!user) {
                throw { status: 404, message: "Usuario no encontrado" };
            }
            return user;
        });
    }
}
exports.UserService = UserService;
