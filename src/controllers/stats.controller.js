import User from "../models/user.model.js";
import Project from "../models/project.model.js";
import Activity from "../models/activity.model.js";

// 📌 Obtener estadísticas generales
export const getGeneralStats = async(req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProjects = await Project.countDocuments();
        const totalActivities = await Activity.countDocuments();

        res.json({
            success: true,
            data: {
                totalUsers,
                totalProjects,
                totalActivities,
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

// 📌 Estadísticas de usuarios (cuántos usuarios hay por rol)
export const getUserStats = async(req, res) => {
    try {
        const rolesCount = await User.aggregate([
            { $group: { _id: "$role", count: { $sum: 1 } } },
        ]);

        res.json({
            success: true,
            data: rolesCount.reduce((acc, role) => {
                acc[role._id] = role.count;
                return acc;
            }, {}),
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

// 📌 Estadísticas de proyectos (cantidad de proyectos por estado)
export const getProjectStats = async(req, res) => {
    try {
        const projectStatusCount = await Project.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);

        res.json({
            success: true,
            data: projectStatusCount.reduce((acc, status) => {
                acc[status._id] = status.count;
                return acc;
            }, {}),
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

// 📌 Estadísticas de actividades (cuántas actividades de cada tipo)
export const getActivityStats = async(req, res) => {
    try {
        const activityTypeCount = await Activity.aggregate([
            { $group: { _id: "$type", count: { $sum: 1 } } },
        ]);

        res.json({
            success: true,
            data: activityTypeCount.reduce((acc, activity) => {
                acc[activity._id] = activity.count;
                return acc;
            }, {}),
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