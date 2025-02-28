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
exports.AttendanceService = void 0;
// src/services/attendance.service.ts
const db_1 = __importDefault(require("../config/db"));
class AttendanceService {
    // Método ya implementado para crear asistencia
    createAttendance(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const attendance = yield db_1.default.asistencia.create({
                data: {
                    idAlumno: data.idAlumno,
                    fecha: data.fecha,
                    estado: data.estado,
                },
            });
            return attendance;
        });
    }
    // Consulta un registro de asistencia por su ID
    getAttendanceById(attendanceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const attendance = yield db_1.default.asistencia.findUnique({
                where: { id: attendanceId },
            });
            if (!attendance) {
                throw { status: 404, message: "Registro de asistencia no encontrado" };
            }
            return attendance;
        });
    }
    // Obtiene todos los registros de asistencia
    getAllAttendances() {
        return __awaiter(this, void 0, void 0, function* () {
            const attendances = yield db_1.default.asistencia.findMany({
                include: {
                    alumno: true, // Incluir los datos del alumno relacionado
                },
            });
            return attendances;
        });
    }
    // Actualiza un registro de asistencia por su ID
    updateAttendance(attendanceId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const attendance = yield db_1.default.asistencia.update({
                where: { id: attendanceId },
                data,
            });
            return attendance;
        });
    }
    // Elimina un registro de asistencia por su ID
    deleteAttendance(attendanceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const attendance = yield db_1.default.asistencia.delete({
                where: { id: attendanceId },
            });
            return attendance;
        });
    }
}
exports.AttendanceService = AttendanceService;
