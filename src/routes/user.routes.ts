// src/routes/user.routes.ts
import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import { CreateUserDtoSchema, UpdateUserDtoSchema } from "../dtos/user.dto";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();
const userController = new UserController();

// Crear un nuevo usuario
router.post("/", validate(CreateUserDtoSchema), (req, res, next) => {
  userController.createUser(req, res, next);
});

// Actualizar un usuario existente (requiere autenticación)
router.put(
  "/:id",
  authenticate,
  validate(UpdateUserDtoSchema),
  async (req, res, next) => {
    await userController.updateUser(req, res, next);
  }
);

// Obtener un usuario por ID (requiere autenticación)
router.get("/:id", authenticate, (req, res, next) => {
  userController.getUser(req, res, next);
});

export default router;
