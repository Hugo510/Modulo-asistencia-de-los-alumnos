import api from "../api";
import type { Student } from "../types";

export class StudentServiceError extends Error {
  status?: number;
  code?: string;
  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "StudentServiceError";
    this.status = status;
    this.code = code;
  }
}

export const studentService = {
  getAllStudents: async (): Promise<Student[]> => {
    try {
      const response = await api.get<Student[]>("/students");
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new StudentServiceError(
          error.response.data?.message || "Error al obtener estudiantes",
          error.response.status,
          error.response.data?.code
        );
      }
      throw new StudentServiceError(
        "No se pudieron cargar los estudiantes",
        undefined,
        "NETWORK_ERROR"
      );
    }
  },

  getStudentById: async (id: number): Promise<Student> => {
    try {
      const response = await api.get<Student>(`/students/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new StudentServiceError(
          "Estudiante no encontrado",
          404,
          "STUDENT_NOT_FOUND"
        );
      } else if (error.response) {
        throw new StudentServiceError(
          error.response.data?.message || "Error al obtener el estudiante",
          error.response.status,
          error.response.data?.code
        );
      }
      throw new StudentServiceError(
        "No se pudo cargar el estudiante",
        undefined,
        "NETWORK_ERROR"
      );
    }
  },

  createStudent: async (studentData: Omit<Student, "id">): Promise<Student> => {
    try {
      const response = await api.post<Student>("/students", studentData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new StudentServiceError(
          "Datos del estudiante inválidos",
          400,
          "INVALID_STUDENT_DATA"
        );
      } else if (error.response) {
        throw new StudentServiceError(
          error.response.data?.message || "Error al crear el estudiante",
          error.response.status,
          error.response.data?.code
        );
      }
      throw new StudentServiceError(
        "No se pudo crear el estudiante",
        undefined,
        "NETWORK_ERROR"
      );
    }
  },

  updateStudent: async (
    id: number,
    studentData: Partial<Omit<Student, "id">>
  ): Promise<Student> => {
    try {
      const response = await api.put<Student>(`/students/${id}`, studentData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new StudentServiceError(
          "Estudiante no encontrado",
          404,
          "STUDENT_NOT_FOUND"
        );
      } else if (error.response?.status === 400) {
        throw new StudentServiceError(
          "Datos del estudiante inválidos",
          400,
          "INVALID_STUDENT_DATA"
        );
      } else if (error.response) {
        throw new StudentServiceError(
          error.response.data?.message || "Error al actualizar el estudiante",
          error.response.status,
          error.response.data?.code
        );
      }
      throw new StudentServiceError(
        "No se pudo actualizar el estudiante",
        undefined,
        "NETWORK_ERROR"
      );
    }
  },

  deleteStudent: async (id: number): Promise<boolean> => {
    try {
      await api.delete(`/students/${id}`);
      return true;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new StudentServiceError(
          "Estudiante no encontrado",
          404,
          "STUDENT_NOT_FOUND"
        );
      } else if (error.response) {
        throw new StudentServiceError(
          error.response.data?.message || "Error al eliminar el estudiante",
          error.response.status,
          error.response.data?.code
        );
      }
      throw new StudentServiceError(
        "No se pudo eliminar el estudiante",
        undefined,
        "NETWORK_ERROR"
      );
    }
  },
};
