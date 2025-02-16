import Data from "../models/data.model.js";

// 📌 Crear un nuevo registro de datos
export const createData = async(req, res) => {
    try {
        const { title, description, category } = req.body;
        const owner = req.user.id;

        if (!title || !description || !category) {
            return res.status(400).json({
                success: false,
                error: "Todos los campos son obligatorios",
                code: "MISSING_FIELDS",
                timestamp: new Date().toISOString(),
            });
        }

        const newData = new Data({ title, description, category, owner });
        await newData.save();

        res.status(201).json({
            success: true,
            data: {
                id: newData._id.toString(),
                title: newData.title,
                description: newData.description,
                category: newData.category,
                createdAt: newData.createdAt.toISOString(),
                updatedAt: newData.updatedAt.toISOString(),
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

// 📌 Obtener todos los registros de datos (con paginación)
export const getAllData = async(req, res) => {
    try {
        const { page = 1, pageSize = 10 } = req.query;

        const totalItems = await Data.countDocuments();
        const totalPages = Math.ceil(totalItems / pageSize);
        const dataRecords = await Data.find()
            .populate("owner", "name email")
            .skip((page - 1) * pageSize)
            .limit(Number(pageSize));

        res.json({
            success: true,
            data: {
                records: dataRecords.map((record) => ({
                    id: record._id.toString(),
                    title: record.title,
                    description: record.description,
                    category: record.category,
                    owner: {
                        id: record.owner._id.toString(),
                        name: record.owner.name,
                        email: record.owner.email,
                    },
                    createdAt: record.createdAt.toISOString(),
                    updatedAt: record.updatedAt.toISOString(),
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

// 📌 Obtener un solo registro por ID
export const getDataById = async(req, res) => {
    try {
        const { id } = req.params;
        const record = await Data.findById(id).populate("owner", "name email");

        if (!record) {
            return res.status(404).json({
                success: false,
                error: "Registro no encontrado",
                code: "DATA_NOT_FOUND",
                timestamp: new Date().toISOString(),
            });
        }

        res.json({
            success: true,
            data: {
                id: record._id.toString(),
                title: record.title,
                description: record.description,
                category: record.category,
                owner: {
                    id: record.owner._id.toString(),
                    name: record.owner.name,
                    email: record.owner.email,
                },
                createdAt: record.createdAt.toISOString(),
                updatedAt: record.updatedAt.toISOString(),
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

// 📌 Actualizar un registro de datos
export const updateData = async(req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category } = req.body;

        const updatedRecord = await Data.findByIdAndUpdate(
            id, { title, description, category, updatedAt: Date.now() }, { new: true }
        );

        if (!updatedRecord) {
            return res.status(404).json({
                success: false,
                error: "Registro no encontrado",
                code: "DATA_NOT_FOUND",
                timestamp: new Date().toISOString(),
            });
        }

        res.json({
            success: true,
            data: {
                id: updatedRecord._id.toString(),
                title: updatedRecord.title,
                description: updatedRecord.description,
                category: updatedRecord.category,
                createdAt: updatedRecord.createdAt.toISOString(),
                updatedAt: updatedRecord.updatedAt.toISOString(),
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

// 📌 Eliminar un registro de datos
export const deleteData = async(req, res) => {
    try {
        const { id } = req.params;
        const deletedRecord = await Data.findByIdAndDelete(id);

        if (!deletedRecord) {
            return res.status(404).json({
                success: false,
                error: "Registro no encontrado",
                code: "DATA_NOT_FOUND",
                timestamp: new Date().toISOString(),
            });
        }

        res.json({
            success: true,
            message: "Registro eliminado exitosamente",
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