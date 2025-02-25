// src/dtos/attendance.dto.ts
import { z } from "zod";

export const CreateAttendanceDtoSchema = z.object({
  idAlumno: z.number({
    required_error: "El identificador del alumno es requerido",
  }),
  fecha: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
  }, z.date({ required_error: "La fecha es requerida" })),
  estado: z.enum(["presente", "ausente", "tardanza"], {
    errorMap: () => ({
      message: "El estado debe ser 'presente', 'ausente' o 'tardanza'",
    }),
  }),
});

export type CreateAttendanceDto = z.infer<typeof CreateAttendanceDtoSchema>;
