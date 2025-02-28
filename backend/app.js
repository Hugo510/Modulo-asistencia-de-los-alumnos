"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_1 = require("./config/swagger");
const logger_1 = __importDefault(require("./config/logger"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const group_routes_1 = __importDefault(require("./routes/group.routes"));
const student_routes_1 = __importDefault(require("./routes/student.routes"));
const attendance_routes_1 = __importDefault(require("./routes/attendance.routes"));
// Importa el middleware centralizado para el manejo de errores
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const app = (0, express_1.default)();
// Seguridad y configuración de cabeceras
app.use((0, helmet_1.default)());
// Permitir peticiones desde otros orígenes (CORS)
app.use((0, cors_1.default)());
// Analiza los cuerpos de las peticiones en formato JSON
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Logging de las peticiones HTTP con Morgan, redirigiendo los logs a Winston
app.use((0, morgan_1.default)("combined", {
    stream: { write: (message) => logger_1.default.info(message.trim()) },
}));
// Configuración de Swagger para la documentación interactiva de la API
(0, swagger_1.setupSwagger)(app);
// Registro de rutas
app.use("/api/auth", auth_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/groups", group_routes_1.default);
app.use("/api/students", student_routes_1.default);
app.use("/api/attendance", attendance_routes_1.default);
// Endpoint de salud para verificar que el servidor esté activo
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});
// Middleware para manejar errores de forma centralizada
app.use(error_middleware_1.default);
exports.default = app;
