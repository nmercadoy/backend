import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { TOKEN_SECRET } from "../../config.js";

// 📌 Registro de usuario
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

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: "La contraseña debe tener al menos 6 caracteres",
                code: "WEAK_PASSWORD",
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
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: "user", // Almacenar el rol en la base de datos
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id, role: "user" }, TOKEN_SECRET, { expiresIn: "1h" });

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: newUser._id.toString(),
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    createdAt: newUser.createdAt.toISOString(),
                },
                token,
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
export const getUserById = async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select("-password"); // No mostrar la contraseña

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "Usuario no encontrado",
                code: "USER_NOT_FOUND",
                timestamp: new Date().toISOString(),
            });
        }

        res.json({ success: true, data: user });
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

export const updateUser = async(req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;

        // 📌 Buscar usuario
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "Usuario no encontrado",
                code: "USER_NOT_FOUND",
                timestamp: new Date().toISOString(),
            });
        }

        // 📌 Solo actualizar los campos permitidos
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    error: "La contraseña debe tener al menos 6 caracteres",
                    code: "WEAK_PASSWORD",
                    timestamp: new Date().toISOString(),
                });
            }
            user.password = await bcrypt.hash(password, 10);
        }

        // 📌 Guardar cambios
        await user.save();

        res.json({
            success: true,
            message: "Usuario actualizado exitosamente",
            data: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                updatedAt: user.updatedAt.toISOString(),
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
export const getAllUsers = async(req, res) => {
    try {
        // 📌 Obtener todos los usuarios y excluir la contraseña
        const users = await User.find().select("-password");

        res.json({
            success: true,
            data: users,
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

// 📌 Eliminar usuario por ID
export const deleteUser = async(req, res) => {
    try {
        const { id } = req.params;

        // 📌 Verificar si el usuario existe antes de eliminarlo
        const userExists = await User.exists({ _id: id });

        if (!userExists) {
            return res.status(404).json({
                success: false,
                error: "Usuario no encontrado",
                code: "USER_NOT_FOUND",
                timestamp: new Date().toISOString(),
            });
        }

        // 📌 Eliminar usuario
        await User.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Usuario eliminado exitosamente",
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


// 📌 Login de usuario
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

        // 🔹 Generar token con duración personalizada según `rememberMe`
        const token = jwt.sign({ id: user._id, role: user.role }, TOKEN_SECRET, {
            expiresIn: rememberMe ? "7d" : "1h",
        });

        // 🔹 Guardar `lastLogin` en la base de datos
        user.lastLogin = new Date();
        await user.save();

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
                    role: user.role,
                    lastLogin: user.lastLogin.toISOString(),
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