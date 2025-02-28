import api from "../api";
import type { AttendanceRecord } from "../types";

export class AttendanceServiceError extends Error {
  status?: number;
  code?: string;
  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "AttendanceServiceError";
    this.status = status;
    this.code = code;
  }
}

export const attendanceService = {
  /**
   * Registrar una nueva asistencia
   */
  createAttendance: async (
    attendanceData: Omit<AttendanceRecord, "id">
  ): Promise<AttendanceRecord> => {
    try {
      const response = await api.post<AttendanceRecord>(
        "/attendance",
        attendanceData
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new AttendanceServiceError(
          "Datos de asistencia inválidos",
          400,
          "INVALID_ATTENDANCE_DATA"
        );
      } else if (error.response) {
        throw new AttendanceServiceError(
          error.response.data?.message || "Error al registrar asistencia",
          error.response.status,
          error.response.data?.code
        );
      }
      throw new AttendanceServiceError(
        "No se pudo registrar la asistencia",
        undefined,
        "NETWORK_ERROR"
      );
    }
  },

  /**
   * Obtener un registro de asistencia por su ID
   */
  getAttendance: async (id: number): Promise<AttendanceRecord> => {
    try {
      const response = await api.get<AttendanceRecord>(`/attendance/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new AttendanceServiceError(
          "Registro de asistencia no encontrado",
          404,
          "ATTENDANCE_NOT_FOUND"
        );
      } else if (error.response) {
        throw new AttendanceServiceError(
          error.response.data?.message ||
            "Error al obtener el registro de asistencia",
          error.response.status,
          error.response.data?.code
        );
      }
      throw new AttendanceServiceError(
        "No se pudo cargar el registro de asistencia",
        undefined,
        "NETWORK_ERROR"
      );
    }
  },

  /**
   * Actualizar un registro de asistencia
   */
  updateAttendance: async (
    id: number,
    attendanceData: Partial<Omit<AttendanceRecord, "id">>
  ): Promise<AttendanceRecord> => {
    try {
      const response = await api.put<AttendanceRecord>(
        `/attendance/${id}`,
        attendanceData
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new AttendanceServiceError(
          "Registro de asistencia no encontrado",
          404,
          "ATTENDANCE_NOT_FOUND"
        );
      } else if (error.response?.status === 400) {
        throw new AttendanceServiceError(
          "Datos de asistencia inválidos",
          400,
          "INVALID_ATTENDANCE_DATA"
        );
      } else if (error.response) {
        throw new AttendanceServiceError(
          error.response.data?.message ||
            "Error al actualizar el registro de asistencia",
          error.response.status,
          error.response.data?.code
        );
      }
      throw new AttendanceServiceError(
        "No se pudo actualizar el registro de asistencia",
        undefined,
        "NETWORK_ERROR"
      );
    }
  },

  /**
   * Eliminar un registro de asistencia
   */
  deleteAttendance: async (id: number): Promise<boolean> => {
    try {
      await api.delete(`/attendance/${id}`);
      return true;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new AttendanceServiceError(
          "Registro de asistencia no encontrado",
          404,
          "ATTENDANCE_NOT_FOUND"
        );
      } else if (error.response) {
        throw new AttendanceServiceError(
          error.response.data?.message ||
            "Error al eliminar el registro de asistencia",
          error.response.status,
          error.response.data?.code
        );
      }
      throw new AttendanceServiceError(
        "No se pudo eliminar el registro de asistencia",
        undefined,
        "NETWORK_ERROR"
      );
    }
  },

  /**
   * Obtener todas las asistencias de un alumno (esta sería una extensión útil)
   */
  getAttendanceByStudent: async (
    idAlumno: number
  ): Promise<AttendanceRecord[]> => {
    try {
      const response = await api.get<AttendanceRecord[]>(
        `/attendance/student/${idAlumno}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new AttendanceServiceError(
          error.response.data?.message ||
            "Error al obtener las asistencias del alumno",
          error.response.status,
          error.response.data?.code
        );
      }
      throw new AttendanceServiceError(
        "No se pudieron cargar las asistencias del alumno",
        undefined,
        "NETWORK_ERROR"
      );
    }
  },

  /**
   * Obtener todas las asistencias por fecha (esta sería una extensión útil)
   */
  getAttendanceByDate: async (fecha: string): Promise<AttendanceRecord[]> => {
    try {
      const response = await api.get<AttendanceRecord[]>(`/attendance/date`, {
        params: { date: fecha },
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new AttendanceServiceError(
          error.response.data?.message ||
            "Error al obtener las asistencias por fecha",
          error.response.status,
          error.response.data?.code
        );
      }
      throw new AttendanceServiceError(
        "No se pudieron cargar las asistencias por fecha",
        undefined,
        "NETWORK_ERROR"
      );
    }
  },

  /**
   * Obtener todas las asistencias sin filtros
   */
  getAllAttendance: async (): Promise<AttendanceRecord[]> => {
    try {
      const response = await api.get<AttendanceRecord[]>("/attendance");
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new AttendanceServiceError(
          error.response.data?.message || "Error al obtener las asistencias",
          error.response.status,
          error.response.data?.code
        );
      }
      throw new AttendanceServiceError(
        "No se pudieron cargar las asistencias",
        undefined,
        "NETWORK_ERROR"
      );
    }
  },
};
