export const errorHandler = (err, req, res, next) => {
    console.error("❌ Error en el servidor:", err);

    res.status(err.status || 500).json({
        success: false,
        error: err.message || "Error interno del servidor",
        code: err.code || "SERVER_ERROR",
        timestamp: new Date().toISOString(),
    });
};