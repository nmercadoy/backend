import express from "express";
import {
    createData,
    getAllData,
    getDataById,
    updateData,
    deleteData,
} from "../controllers/data.controller.js";
import { verifyToken } from "../middlewares/auth.token.js";

import { dataSchema } from "../schemas/data.schema.js";

const router = express.Router();

router.post("/", verifyToken, createData);
router.get("/", getAllData);
router.get("/:id", getDataById);
router.put("/:id", verifyToken, updateData);
router.delete("/:id", verifyToken, deleteData);

export default router;