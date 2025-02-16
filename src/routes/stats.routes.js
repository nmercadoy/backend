import express from "express";
import {
    getGeneralStats,
    getUserStats,
    getProjectStats,
    getActivityStats,
} from "../controllers/stats.controller.js";
import { verifyToken } from "../middlewares/auth.token.js";
const router = express.Router();

router.get("/", verifyToken, getGeneralStats);
router.get("/users", verifyToken, getUserStats);
router.get("/projects", verifyToken, getProjectStats);
router.get("/activity", verifyToken, getActivityStats);

export default router;