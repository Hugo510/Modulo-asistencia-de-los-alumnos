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
exports.StudentService = void 0;
// src/services/student.service.ts
const db_1 = __importDefault(require("../config/db"));
class StudentService {
    // Crea un nuevo alumno y lo asocia a un grupo.
    createStudent(groupId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Se crea el alumno
            const student = yield db_1.default.alumno.create({
                data,
            });
            // Se asocia el alumno al grupo mediante la tabla intermedia
            yield db_1.default.grupoAlumno.create({
                data: {
                    idGrupo: groupId,
                    idAlumno: student.id,
                },
            });
            return student;
        });
    }
    // Actualiza los datos de un alumno.
    updateStudent(studentId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedStudent = yield db_1.default.alumno.update({
                where: { id: studentId },
                data,
            });
            return updatedStudent;
        });
    }
    // Consulta un alumno por su ID.
    getStudentById(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield db_1.default.alumno.findUnique({
                where: { id: studentId },
            });
            if (!student) {
                throw { status: 404, message: "Alumno no encontrado" };
            }
            return student;
        });
    }
    // Obtiene todos los alumnos
    getAllStudents() {
        return __awaiter(this, void 0, void 0, function* () {
            const students = yield db_1.default.alumno.findMany();
            return students;
        });
    }
}
exports.StudentService = StudentService;
