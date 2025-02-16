import { z } from "zod";

export const projectSchema = z.object({
    name: z.string().min(3, "El nombre del proyecto debe tener al menos 3 caracteres"),
    description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
    status: z.enum(["active", "archived", "completed"]).default("active"),
});