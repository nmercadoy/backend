import Activity from "../models/activity.model.js";

// 📌 Obtener todas las actividades con paginación
export const getUserActivities = async(req, res) => {
    try {
        const { page = 1, pageSize = 10 } = req.query;

        const totalItems = await Activity.countDocuments();
        const totalPages = Math.ceil(totalItems / pageSize);
        const activities = await Activity.find()
            .populate("user", "name email")
            .populate("projectId", "name")
            .skip((page - 1) * pageSize)
            .limit(Number(pageSize))
            .sort({ timestamp: -1 });

        res.json({
            success: true,
            data: {
                activities: activities.map((activity) => ({
                    id: activity._id.toString(),
                    type: activity.type,
                    projectId: activity.projectId ? activity.projectId.toString() : null,
                    projectName: activity.projectName || null,
                    description: activity.description,
                    timestamp: activity.timestamp.toISOString(),
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

// 📌 Registrar una nueva actividad
export const logActivity = async(userId, type, projectId, projectName, description) => {
    try {
        const newActivity = new Activity({
            user: userId,
            type,
            projectId,
            projectName,
            description,
        });
        await newActivity.save();
        console.log("✅ Actividad registrada:", newActivity);
    } catch (error) {
        console.error("❌ Error registrando actividad:", error.message);
    }
};