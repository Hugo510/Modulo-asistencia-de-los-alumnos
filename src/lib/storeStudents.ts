import { create } from "zustand";
import { studentService, StudentServiceError } from "./services/studentService";
import type { Student } from "./types";

interface StudentsState {
  students: Student[];
  loading: boolean;
  error: string | null;
  fetchStudents: () => Promise<void>;
  getStudentById: (id: number) => Student | null;
  addStudent: (data: Omit<Student, "id">) => Promise<Student | null>;
  updateStudent: (
    id: number,
    data: Partial<Omit<Student, "id">>
  ) => Promise<boolean>;
  deleteStudent: (id: number) => Promise<boolean>;
}

export const useStudentsStore = create<StudentsState>((set, get) => ({
  students: [],
  loading: false,
  error: null,

  fetchStudents: async () => {
    try {
      set({ loading: true, error: null });
      const students = await studentService.getAllStudents();
      set({ students, loading: false });
    } catch (error) {
      const message =
        error instanceof StudentServiceError
          ? error.message
          : "Error al obtener estudiantes";
      set({ error: message, loading: false });
    }
  },

  getStudentById: (id: number) => {
    return get().students.find((s) => s.id === id) || null;
  },

  addStudent: async (data: Omit<Student, "id">) => {
    try {
      set({ loading: true, error: null });
      const newStudent = await studentService.createStudent(data);
      set((state) => ({
        students: [...state.students, newStudent],
        loading: false,
      }));
      return newStudent;
    } catch (error) {
      const message =
        error instanceof StudentServiceError
          ? error.message
          : "Error al agregar estudiante";
      set({ error: message, loading: false });
      return null;
    }
  },

  updateStudent: async (id: number, data: Partial<Omit<Student, "id">>) => {
    try {
      set({ loading: true, error: null });
      const updatedStudent = await studentService.updateStudent(id, data);
      set((state) => ({
        students: state.students.map((s) => (s.id === id ? updatedStudent : s)),
        loading: false,
      }));
      return true;
    } catch (error) {
      const message =
        error instanceof StudentServiceError
          ? error.message
          : "Error al actualizar estudiante";
      set({ error: message, loading: false });
      return false;
    }
  },

  deleteStudent: async (id: number) => {
    try {
      set({ loading: true, error: null });
      await studentService.deleteStudent(id);
      set((state) => ({
        students: state.students.filter((s) => s.id !== id),
        loading: false,
      }));
      return true;
    } catch (error) {
      const message =
        error instanceof StudentServiceError
          ? error.message
          : "Error al eliminar estudiante";
      set({ error: message, loading: false });
      return false;
    }
  },
}));
