// src/routes/auth.routes.ts
import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { LoginDtoSchema } from "../dtos/auth.dto";

const router = Router();
const authController = new AuthController();

// Endpoint para inicio de sesión
router.post("/login", validate(LoginDtoSchema), (req, res, next) => {
  authController.login(req, res, next);
});

export default router;
