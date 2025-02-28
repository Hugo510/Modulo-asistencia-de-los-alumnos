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
exports.StudentController = void 0;
const student_service_1 = require("../services/student.service");
const studentService = new student_service_1.StudentService();
class StudentController {
    // Crea un alumno y lo asocia a un grupo (se espera que el ID del grupo venga en los parámetros)
    createStudent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const groupId = parseInt(req.params.groupId, 10);
                const data = req.body;
                const student = yield studentService.createStudent(groupId, data);
                res.status(201).json(student);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Actualiza los datos de un alumno existente
    updateStudent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const studentId = parseInt(req.params.id, 10);
                const data = req.body;
                const student = yield studentService.updateStudent(studentId, data);
                res.status(200).json(student);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Consulta un alumno por su ID
    getStudent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const studentId = parseInt(req.params.id, 10);
                const student = yield studentService.getStudentById(studentId);
                res.status(200).json(student);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Obtiene todos los alumnos
    getAllStudents(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const students = yield studentService.getAllStudents();
                res.status(200).json(students);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.StudentController = StudentController;
