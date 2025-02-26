// src/config/swagger.ts
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { env } from "./env"; // Importamos las variables de entorno

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Gestión de Asistencia",
      version: "1.0.0",
      description:
        "Documentación de la API para el sistema de asistencia escolar",
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
      },
    ],
    components: {
      schemas: {
        // Auth DTOs
        LoginDto: {
          type: "object",
          properties: {
            correo: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
          },
          required: ["correo", "password"],
        },
        PasswordRecoveryDto: {
          type: "object",
          properties: {
            correo: { type: "string", format: "email" },
          },
          required: ["correo"],
        },
        ResetPasswordDto: {
          type: "object",
          properties: {
            token: { type: "string" },
            newPassword: { type: "string", minLength: 6 },
          },
          required: ["token", "newPassword"],
        },
        // User DTOs
        CreateUserDto: {
          type: "object",
          properties: {
            nombre: { type: "string" },
            correo: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
            rol: { type: "string", enum: ["profesor", "administrador"] },
          },
          required: ["nombre", "correo", "password"],
        },
        UpdateUserDto: {
          type: "object",
          properties: {
            nombre: { type: "string" },
            correo: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
            rol: { type: "string", enum: ["profesor", "administrador"] },
          },
        },
        // Group DTOs
        CreateGroupDto: {
          type: "object",
          properties: {
            nombre: { type: "string" },
          },
          required: ["nombre"],
        },
        UpdateGroupDto: {
          type: "object",
          properties: {
            nombre: { type: "string" },
          },
        },
        // Student DTOs
        CreateStudentDto: {
          type: "object",
          properties: {
            nombre: { type: "string" },
            apellido: { type: "string" },
            correo: { type: "string", format: "email" },
          },
          required: ["nombre", "apellido"],
        },
        UpdateStudentDto: {
          type: "object",
          properties: {
            nombre: { type: "string" },
            apellido: { type: "string" },
            correo: { type: "string", format: "email" },
          },
        },
        // Attendance DTOs
        CreateAttendanceDto: {
          type: "object",
          properties: {
            idAlumno: { type: "number" },
            fecha: { type: "string", format: "date-time" },
            estado: {
              type: "string",
              enum: ["presente", "ausente", "tardanza"],
            },
          },
          required: ["idAlumno", "fecha", "estado"],
        },
        UpdateAttendanceDto: {
          type: "object",
          properties: {
            fecha: { type: "string", format: "date-time" },
            estado: {
              type: "string",
              enum: ["presente", "ausente", "tardanza"],
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

/**
 * Función para configurar Swagger en la aplicación Express.
 * @param app - Instancia de la aplicación Express
 */
export function setupSwagger(app: Express): void {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
