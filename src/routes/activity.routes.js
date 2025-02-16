import express from "express";
import { getUserActivities } from "../controllers/activity.controller.js";
import { verifyToken } from "../middlewares/auth.token.js";
import { activitySchema } from "../schemas/activity.schema.js";
const router = express.Router();

router.get("/", verifyToken, getUserActivities);

export default router;