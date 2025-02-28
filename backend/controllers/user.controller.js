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
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
const userService = new user_service_1.UserService();
class UserController {
    // Crea un nuevo usuario
    createUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const user = yield userService.createUser(data);
                res.status(201).json(user);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Actualiza los datos de un usuario existente
    updateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id, 10);
                const data = req.body;
                const user = yield userService.updateUser(id, data);
                res.status(200).json(user);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Consulta un usuario por su ID
    getUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id, 10);
                const user = yield userService.getUserById(id);
                res.status(200).json(user);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.UserController = UserController;
