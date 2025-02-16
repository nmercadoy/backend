import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// Importar rutas
import userRoutes from "./src/routes/user.routes.js";
import dataRoutes from "./src/routes/data.routes.js";
import activityRoutes from "./src/routes/activity.routes.js";
import statsRoutes from "./src/routes/stats.routes.js";
import projectRoutes from "./src/routes/project.routes.js";

dotenv.config();

const app = express();

// Configuración de CORS (Permitir cualquier frontend)
app.use(cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
}));

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// Ruta principal (para verificar que el servidor funciona)
app.get("/", (req, res) => {
    res.json({ message: "Bienvenido a EcoStats API 🌱" });
});

// Rutas del API
app.use("/api/users", userRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/projects", projectRoutes);

export default app;