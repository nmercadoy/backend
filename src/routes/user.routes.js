import express from "express";
import { register, login, getAllUsers, getUserById, updateUser, deleteUser } from "../controllers/user.controller.js";
import { registerSchema } from "../schemas/user.schema.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { verifyToken } from "../middlewares/auth.token.js";


const router = express.Router();

// 📌 Rutas de autenticación
router.post("/register", validateSchema(registerSchema), register);
router.post("/login", login);

// 📌 Obtener un usuario por ID (protegido)
router.get("/:id", verifyToken, getUserById);

// 📌 Actualizar usuario por ID (protegido)
router.put("/:id", verifyToken, updateUser);

// 📌 Eliminar usuario por ID (protegido)
router.delete("/:id", verifyToken, deleteUser);

// 📌 Obtener todos los usuarios (solo para administradores)
router.get("/", verifyToken, getAllUsers);

export default router;