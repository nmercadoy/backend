import express from "express";
import {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
} from "../controllers/project.controller.js";
import { verifyToken } from "../middlewares/auth.token.js";
import { projectSchema } from "../schemas/project.schema.js";
const router = express.Router();

router.post("/", verifyToken, createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.put("/:id", verifyToken, updateProject);
router.delete("/:id", verifyToken, deleteProject);

export default router;