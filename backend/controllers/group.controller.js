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
exports.GroupController = void 0;
const group_service_1 = require("../services/group.service");
const groupService = new group_service_1.GroupService();
class GroupController {
    // Crea un nuevo grupo asignándolo al usuario autenticado
    createGroup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Se asume que el middleware de autenticación añade 'user' a la solicitud
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    throw { status: 401, message: "Usuario no autenticado" };
                }
                const data = req.body;
                const group = yield groupService.createGroup(userId, data);
                res.status(201).json(group);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Actualiza un grupo existente
    updateGroup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const groupId = parseInt(req.params.id, 10);
                const data = req.body;
                const group = yield groupService.updateGroup(groupId, data);
                res.status(200).json(group);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Obtiene todos los grupos asociados al usuario autenticado
    getGroups(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    throw { status: 401, message: "Usuario no autenticado" };
                }
                const groups = yield groupService.getGroupsByUser(userId);
                res.status(200).json(groups);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.GroupController = GroupController;
