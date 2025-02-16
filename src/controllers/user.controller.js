import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { TOKEN_SECRET } from "../../config.js";

// 📌 Registro de usuario (siguiendo `RegisterUserResponse`)
export const register = async(req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                error: "Todos los campos son obligatorios",
                code: "MISSING_FIELDS",
                timestamp: new Date().toISOString(),
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                error: "Las contraseñas no coinciden",
                code: "PASSWORD_MISMATCH",
                timestamp: new Date().toISOString(),
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: "El email ya está registrado",
                code: "EMAIL_EXISTS",
                timestamp: new Date().toISOString(),
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, TOKEN_SECRET, { expiresIn: "1h" });

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: newUser._id.toString(),
                    name: newUser.name,
                    email: newUser.email,
                    role: "user",
                    createdAt: newUser.createdAt.toISOString(),
                },
                token,
            },
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Error en el servidor",
            details: [error.message],
            code: "SERVER_ERROR",
            timestamp: new Date().toISOString(),
        });
    }
};

// 📌 Login de usuario (siguiendo `LoginUserResponse`)
export const login = async(req, res) => {
    try {
        console.log("📥 Datos recibidos en backend:", req.body);

        const { email, password, rememberMe, page = 1, pageSize = 10 } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: "Todos los campos son obligatorios",
                code: "MISSING_FIELDS",
                timestamp: new Date().toISOString(),
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                error: "Usuario no encontrado",
                code: "USER_NOT_FOUND",
                timestamp: new Date().toISOString(),
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                error: "Contraseña incorrecta",
                code: "INVALID_CREDENTIALS",
                timestamp: new Date().toISOString(),
            });
        }

        const token = jwt.sign({ id: user._id }, TOKEN_SECRET, {
            expiresIn: rememberMe ? "7d" : "1h",
        });

        // 🔹 Simulación de actividades con paginación
        const activities = [
            { id: "1", type: "project_created", description: "Nuevo proyecto creado", timestamp: new Date().toISOString() },
            { id: "2", type: "analysis_run", description: "Ejecutó un análisis", timestamp: new Date().toISOString() },
            { id: "3", type: "data_imported", description: "Importó datos", timestamp: new Date().toISOString() },
        ];

        const totalItems = activities.length;
        const totalPages = Math.ceil(totalItems / pageSize);
        const paginatedActivities = activities.slice((page - 1) * pageSize, page * pageSize);

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: "user",
                    lastLogin: new Date().toISOString(),
                },
                token,
                activities: paginatedActivities,
                pagination: {
                    page: Number(page),
                    pageSize: Number(pageSize),
                    totalPages,
                    totalItems,
                },
            },
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("❌ Error en el backend:", error);
        res.status(500).json({
            success: false,
            error: "Error en el servidor",
            details: [error.message],
            code: "SERVER_ERROR",
            timestamp: new Date().toISOString(),
        });
    }
};