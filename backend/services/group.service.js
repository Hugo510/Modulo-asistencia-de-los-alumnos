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
exports.GroupService = void 0;
// src/services/group.service.ts
const db_1 = __importDefault(require("../config/db"));
class GroupService {
    // Crea un nuevo grupo y lo asigna al usuario autenticado.
    createGroup(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newGroup = yield db_1.default.grupo.create({
                data: Object.assign(Object.assign({}, data), { idUsuario: userId }),
            });
            return newGroup;
        });
    }
    // Actualiza la información de un grupo existente.
    updateGroup(groupId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedGroup = yield db_1.default.grupo.update({
                where: { id: groupId },
                data,
            });
            return updatedGroup;
        });
    }
    // Obtiene todos los grupos asociados a un usuario.
    getGroupsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const groups = yield db_1.default.grupo.findMany({
                where: { idUsuario: userId },
                include: {
                    alumnos: {
                        include: {
                            alumno: true,
                        },
                    },
                },
            });
            // Transformamos los datos para tener una estructura más limpia
            return groups.map((group) => (Object.assign(Object.assign({}, group), { alumnos: group.alumnos.map((ga) => ga.alumno) })));
        });
    }
}
exports.GroupService = GroupService;
