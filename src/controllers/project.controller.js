import Project from "../models/project.model.js";

// 📌 Crear un nuevo proyecto
export const createProject = async(req, res) => {
    try {
        const { name, description, status } = req.body;
        const owner = req.user.id; // Usuario autenticado como dueño

        if (!name || !description) {
            return res.status(400).json({
                success: false,
                error: "El nombre y la descripción son obligatorios",
                code: "MISSING_FIELDS",
                timestamp: new Date().toISOString(),
            });
        }

        const newProject = new Project({ name, description, status, owner });
        await newProject.save();

        res.status(201).json({
            success: true,
            data: {
                project: {
                    id: newProject._id.toString(),
                    name: newProject.name,
                    description: newProject.description,
                    role: "owner",
                    status: newProject.status,
                    createdAt: newProject.createdAt.toISOString(),
                    updatedAt: newProject.updatedAt.toISOString(),
                },
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

// 📌 Obtener todos los proyectos (con paginación)
export const getProjects = async(req, res) => {
    try {
        const { page = 1, pageSize = 10 } = req.query;

        const totalItems = await Project.countDocuments();
        const totalPages = Math.ceil(totalItems / pageSize);
        const projects = await Project.find()
            .populate("owner", "name email")
            .skip((page - 1) * pageSize)
            .limit(Number(pageSize));

        res.json({
            success: true,
            data: {
                projects: projects.map((project) => ({
                    id: project._id.toString(),
                    name: project.name,
                    description: project.description,
                    role: "owner",
                    status: project.status,
                    createdAt: project.createdAt.toISOString(),
                    updatedAt: project.updatedAt.toISOString(),
                })),
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
        res.status(500).json({
            success: false,
            error: "Error en el servidor",
            details: [error.message],
            code: "SERVER_ERROR",
            timestamp: new Date().toISOString(),
        });
    }
};

// 📌 Obtener un solo proyecto por ID
export const getProjectById = async(req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id).populate("owner", "name email");

        if (!project) {
            return res.status(404).json({
                success: false,
                error: "Proyecto no encontrado",
                code: "PROJECT_NOT_FOUND",
                timestamp: new Date().toISOString(),
            });
        }

        res.json({
            success: true,
            data: {
                project: {
                    id: project._id.toString(),
                    name: project.name,
                    description: project.description,
                    role: "owner",
                    status: project.status,
                    createdAt: project.createdAt.toISOString(),
                    updatedAt: project.updatedAt.toISOString(),
                },
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

// 📌 Actualizar un proyecto
export const updateProject = async(req, res) => {
    try {
        const { id } = req.params;
        const { name, description, status } = req.body;

        const updatedProject = await Project.findByIdAndUpdate(
            id, { name, description, status, updatedAt: Date.now() }, { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({
                success: false,
                error: "Proyecto no encontrado",
                code: "PROJECT_NOT_FOUND",
                timestamp: new Date().toISOString(),
            });
        }

        res.json({
            success: true,
            data: {
                project: {
                    id: updatedProject._id.toString(),
                    name: updatedProject.name,
                    description: updatedProject.description,
                    role: "owner",
                    status: updatedProject.status,
                    createdAt: updatedProject.createdAt.toISOString(),
                    updatedAt: updatedProject.updatedAt.toISOString(),
                },
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

// 📌 Eliminar un proyecto
export const deleteProject = async(req, res) => {
    try {
        const { id } = req.params;
        const deletedProject = await Project.findByIdAndDelete(id);

        if (!deletedProject) {
            return res.status(404).json({
                success: false,
                error: "Proyecto no encontrado",
                code: "PROJECT_NOT_FOUND",
                timestamp: new Date().toISOString(),
            });
        }

        res.json({
            success: true,
            message: "Proyecto eliminado exitosamente",
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