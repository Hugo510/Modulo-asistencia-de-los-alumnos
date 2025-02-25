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
        url: `http://localhost:${env.PORT}`, // Utiliza el puerto definido en las variables de entorno
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Rutas donde se encuentran las anotaciones Swagger
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

/**
 * Función para configurar Swagger en la aplicación Express.
 * @param app - Instancia de la aplicación Express
 */
export function setupSwagger(app: Express): void {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
