// src/app.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { setupSwagger } from "./config/swagger";
import logger from "./config/logger";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import groupRoutes from "./routes/group.routes";
import studentRoutes from "./routes/student.routes";
import attendanceRoutes from "./routes/attendance.routes";

// Importa el middleware centralizado para el manejo de errores
import errorHandler from "./middlewares/error.middleware";

const app = express();

// Seguridad y configuración de cabeceras
app.use(helmet());

// Permitir peticiones desde otros orígenes (CORS)
app.use(cors());

// Analiza los cuerpos de las peticiones en formato JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging de las peticiones HTTP con Morgan, redirigiendo los logs a Winston
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// Configuración de Swagger para la documentación interactiva de la API
setupSwagger(app);

// Registro de rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
// Endpoint de salud para verificar que el servidor esté activo
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Middleware para manejar errores de forma centralizada
app.use(errorHandler);

export default app;
