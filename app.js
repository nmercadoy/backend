import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// Importar rutas
import userRoutes from "./src/routes/user.routes.js";
import dataRoutes from "./src/routes/data.routes.js"; // 🔹 Corrección: nombre correcto
import activityRoutes from "./src/routes/activity.routes.js";
import statsRoutes from "./src/routes/stats.routes.js";
import projectRoutes from "./src/routes/project.routes.js";


dotenv.config();

const app = express();

// Configuración de CORS (Permitir múltiples orígenes en producción)
const allowedOrigins = ["http://localhost:5173"];
app.use(cors({
    origin: allowedOrigins,
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
app.use("/api/users", userRoutes); // Gestión de usuarios
app.use("/api/data", dataRoutes); // Datos ambientales (CO₂, agua, residuos)
app.use("/api/activity", activityRoutes); // Actividades del usuario
app.use("/api/stats", statsRoutes); // Estadísticas del sistema
app.use("/api/projects", projectRoutes); // Proyectos ambientales

export default app;