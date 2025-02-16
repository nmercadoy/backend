import dotenv from "dotenv";

dotenv.config(); // Cargar variables de entorno desde .env

export const PORT = process.env.PORT || 5000;
export const MONGODB_URI = process.env.MONGO_URI;
export const TOKEN_SECRET = process.env.TOKEN_SECRET || "secret_1234";
export const FRONTEND_URL = process.env.FRONTEND_URL;