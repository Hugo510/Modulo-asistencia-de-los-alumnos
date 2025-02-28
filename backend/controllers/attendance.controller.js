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
exports.AttendanceController = void 0;
const attendance_service_1 = require("../services/attendance.service");
const attendanceService = new attendance_service_1.AttendanceService();
class AttendanceController {
    // Método para crear un registro de asistencia (ya implementado)
    createAttendance(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const attendance = yield attendanceService.createAttendance(data);
                res.status(201).json(attendance);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Consulta un registro de asistencia por ID
    getAttendance(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const attendanceId = parseInt(req.params.id, 10);
                const attendance = yield attendanceService.getAttendanceById(attendanceId);
                res.status(200).json(attendance);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Obtiene todos los registros de asistencia
    getAllAttendances(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const attendances = yield attendanceService.getAllAttendances();
                res.status(200).json(attendances);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Actualiza un registro de asistencia por ID
    updateAttendance(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const attendanceId = parseInt(req.params.id, 10);
                const data = req.body;
                const attendance = yield attendanceService.updateAttendance(attendanceId, data);
                res.status(200).json(attendance);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Elimina un registro de asistencia por ID
    deleteAttendance(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const attendanceId = parseInt(req.params.id, 10);
                const attendance = yield attendanceService.deleteAttendance(attendanceId);
                res.status(200).json(attendance);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AttendanceController = AttendanceController;
