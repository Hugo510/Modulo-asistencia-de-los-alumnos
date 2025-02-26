import api from "../api";
import type { Group, Student, GroupStudent, AttendanceRecord } from "../types";

// Clase personalizada de error para operaciones de grupos
export class GroupServiceError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "GroupServiceError";
    this.status = status;
    this.code = code;
  }
}

export const groupService = {
  /**
   * Obtener todos los grupos
   */
  getAllGroups: async (): Promise<Group[]> => {
    try {
      const response = await api.get<Group[]>("/groups");
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new GroupServiceError(
          error.response.data?.message || "Error al obtener grupos",
          error.response.status,
          error.response.data?.code
        );
      }
      throw new GroupServiceError(
        "No se pudieron cargar los grupos",
        undefined,
        "NETWORK_ERROR"
      );
    }
  },

  /**
   * Obtener un grupo por ID
   */
  getGroupById: async (id: number): Promise<Group> => {
    try {
      const response = await api.get<Group>(`/groups/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new GroupServiceError(
          "Grupo no encontrado",
          404,
          "GROUP_NOT_FOUND"
        );
      } else if (error.response) {
        throw new GroupServiceError(
          error.response.data?.message || "Error al obtener el grupo",
          error.response.status,
          error.response.data?.code
        );
      }
      throw new GroupServiceError(
        "No se pudo cargar el grupo",
        undefined,
        "NETWORK_ERROR"
      );
    }
  },

  /**
   * Crear un nuevo grupo
   *
   * Ahora se espera groupData con campos: nombre y idUsuario.
   */
  createGroup: async (groupData: Omit<Group, "id">): Promise<Group> => {
    try {
      const response = await api.post<Group>("/groups", groupData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new GroupServiceError(
          "Datos del grupo inválidos",
          400,
          "INVALID_GROUP_DATA"
        );
      } else if (error.response) {
        throw new GroupServiceError(
          error.response.data?.message || "Error al crear el grupo",
          error.response.status,
          error.response.data?.code
        );
      }
      throw new GroupServiceError(
        "No se pudo crear el grupo",
        undefined,
        "NETWORK_ERROR"
      );
    }
  },

  /**
   * Actualizar un grupo existente
   */
  updateGroup: async (
    id: number,
    groupData: Partial<Group>
  ): Promise<Group> => {
    try {
      const response = await api.put<Group>(`/groups/${id}`, groupData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new GroupServiceError(
          "Grupo no encontrado",
          404,
          "GROUP_NOT_FOUND"
        );
      } else if (error.response?.status === 400) {
        throw new GroupServiceError(
          "Datos del grupo inválidos",
          400,
          "INVALID_GROUP_DATA"
        );
      } else if (error.response) {
        throw new GroupServiceError(
          error.response.data?.message || "Error al actualizar el grupo",
          error.response.status,
          error.response.data?.code
        );
      }
      throw new GroupServiceError(
        "No se pudo actualizar el grupo",
        undefined,
        "NETWORK_ERROR"
      );
    }
  },

  /**
   * Eliminar un grupo
   */
  deleteGroup: async (id: number): Promise<boolean> => {
    try {
      await api.delete(`/groups/${id}`);
      return true;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new GroupServiceError(
          "Grupo no encontrado",
          404,
          "GROUP_NOT_FOUND"
        );
      } else if (error.response) {
        throw new GroupServiceError(
          error.response.data?.message || "Error al eliminar el grupo",
          error.response.status,
          error.response.data?.code
        );
      }
      throw new GroupServiceError(
        "No se pudo eliminar el grupo",
        undefined,
        "NETWORK_ERROR"
      );
    }
  },

  /**
   * Obtener estudiantes de un grupo
   */
  getGroupStudents: async (groupId: number): Promise<Student[]> => {
    try {
      const response = await api.get<Student[]>(`/groups/${groupId}/students`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new GroupServiceError(
          "Grupo no encontrado",
          404,
          "GROUP_NOT_FOUND"
        );
      } else if (error.response) {
        throw new GroupServiceError(
          error.response.data?.message ||
            "Error al obtener estudiantes del grupo",
          error.response.status,
          error.response.data?.code
        );
      }
      throw new GroupServiceError(
        "No se pudieron cargar los estudiantes",
        undefined,
        "NETWORK_ERROR"
      );
    }
  },

  /**
   * Añadir un estudiante a un grupo
   */
  addStudentToGroup: async (
    groupId: number,
    studentId: string
  ): Promise<GroupStudent> => {
    try {
      const response = await api.post<GroupStudent>(
        `/groups/${groupId}/students`,
        { studentId }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new GroupServiceError(
          "Grupo o estudiante no encontrado",
          404,
          "NOT_FOUND"
        );
      } else if (error.response?.status === 409) {
        throw new GroupServiceError(
          "El estudiante ya está en el grupo",
          409,
          "STUDENT_ALREADY_IN_GROUP"
        );
      } else if (error.response) {
        throw new GroupServiceError(
          error.response.data?.message || "Error al añadir estudiante al grupo",
          error.response.status,
          error.response.data?.code
        );
      }
      throw new GroupServiceError(
        "No se pudo añadir el estudiante al grupo",
        undefined,
        "NETWORK_ERROR"
      );
    }
  },

  /**
   * Registrar asistencia para un estudiante
   */
  registerAttendance: async (
    attendanceData: Omit<AttendanceRecord, "id" | "recordedAt">
  ): Promise<AttendanceRecord> => {
    try {
      const response = await api.post<AttendanceRecord>(
        "/attendance",
        attendanceData
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new GroupServiceError(
          "Grupo o estudiante no encontrado",
          404,
          "NOT_FOUND"
        );
      } else if (error.response?.status === 400) {
        throw new GroupServiceError(
          "Datos de asistencia inválidos",
          400,
          "INVALID_ATTENDANCE_DATA"
        );
      } else if (error.response) {
        throw new GroupServiceError(
          error.response.data?.message || "Error al registrar asistencia",
          error.response.status,
          error.response.data?.code
        );
      }
      throw new GroupServiceError(
        "No se pudo registrar la asistencia",
        undefined,
        "NETWORK_ERROR"
      );
    }
  },

  /**
   * Obtener registros de asistencia para un grupo en una fecha específica
   */
  getAttendanceByDate: async (
    groupId: number,
    date: string
  ): Promise<AttendanceRecord[]> => {
    try {
      const response = await api.get<AttendanceRecord[]>(
        `/attendance/${groupId}`,
        {
          params: { date },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new GroupServiceError(
          "Grupo no encontrado",
          404,
          "GROUP_NOT_FOUND"
        );
      } else if (error.response) {
        throw new GroupServiceError(
          error.response.data?.message ||
            "Error al obtener registros de asistencia",
          error.response.status,
          error.response.data?.code
        );
      }
      throw new GroupServiceError(
        "No se pudieron cargar los registros de asistencia",
        undefined,
        "NETWORK_ERROR"
      );
    }
  },
};
