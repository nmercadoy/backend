import { z } from "zod";

export const activitySchema = z.object({
    type: z.enum(["project_created", "project_updated", "analysis_run", "data_imported"]),
    description: z.string().min(5, "La descripción es obligatoria"),
    projectId: z.string().optional(),
});