// src/routes/group.routes.ts
import { Router } from "express";
import { GroupController } from "../controllers/group.controller";
import { validate } from "../middlewares/validate.middleware";
import { CreateGroupDtoSchema, UpdateGroupDtoSchema } from "../dtos/group.dto";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();
const groupController = new GroupController();

// Crear un nuevo grupo (requiere autenticación)
router.post(
  "/",
  authenticate,
  validate(CreateGroupDtoSchema),
  (req, res, next) => {
    groupController.createGroup(req, res, next);
  }
);

// Actualizar un grupo existente (requiere autenticación)
router.put(
  "/:id",
  authenticate,
  validate(UpdateGroupDtoSchema),
  (req, res, next) => {
    groupController.updateGroup(req, res, next);
  }
);

// Obtener todos los grupos asociados al usuario autenticado
router.get("/", authenticate, (req, res, next) => {
  groupController.getGroups(req, res, next);
});

export default router;
