import { create } from "zustand";
import { parseISO, isSameDay } from "date-fns";
import {
  attendanceService,
  AttendanceServiceError,
} from "./services/attendanceService";
import type { AttendanceRecord } from "./types";

interface AttendanceState {
  attendanceRecords: AttendanceRecord[];
  loading: boolean;
  error: string | null;

  // Acciones
  registerAttendance: (
    data: Omit<AttendanceRecord, "id">
  ) => Promise<AttendanceRecord | null>;
  getAttendanceById: (id: number) => Promise<AttendanceRecord | null>;
  updateAttendance: (
    id: number,
    data: Partial<Omit<AttendanceRecord, "id">>
  ) => Promise<boolean>;
  deleteAttendance: (id: number) => Promise<boolean>;

  // Cargar asistencias por alumno o fecha
  fetchAttendanceByStudent: (idAlumno: number) => Promise<void>;
  fetchAttendanceByDate: (fecha: string) => Promise<void>;

  // Nueva acción para obtener todas las asistencias
  fetchAllAttendance: () => Promise<void>;

  // Selectores
  getAttendancesByStudent: (idAlumno: number) => AttendanceRecord[];
  getAttendancesByDate: (fecha: string) => AttendanceRecord[];

  // Utilidades
  clearError: () => void;
}

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  attendanceRecords: [],
  loading: false,
  error: null,

  registerAttendance: async (data) => {
    try {
      set({ loading: true, error: null });
      const newAttendance = await attendanceService.createAttendance(data);
      set((state) => ({
        attendanceRecords: [...state.attendanceRecords, newAttendance],
        loading: false,
      }));
      return newAttendance;
    } catch (error) {
      const message =
        error instanceof AttendanceServiceError
          ? error.message
          : "Error al registrar asistencia";
      set({ error: message, loading: false });
      return null;
    }
  },

  getAttendanceById: async (id) => {
    try {
      set({ loading: true, error: null });
      const attendance = await attendanceService.getAttendance(id);
      set({ loading: false });
      return attendance;
    } catch (error) {
      const message =
        error instanceof AttendanceServiceError
          ? error.message
          : "Error al obtener asistencia";
      set({ error: message, loading: false });
      return null;
    }
  },

  updateAttendance: async (id, data) => {
    try {
      set({ loading: true, error: null });
      const updatedAttendance = await attendanceService.updateAttendance(
        id,
        data
      );
      set((state) => ({
        attendanceRecords: state.attendanceRecords.map((record) =>
          record.id === id ? updatedAttendance : record
        ),
        loading: false,
      }));
      return true;
    } catch (error) {
      const message =
        error instanceof AttendanceServiceError
          ? error.message
          : "Error al actualizar asistencia";
      set({ error: message, loading: false });
      return false;
    }
  },

  deleteAttendance: async (id) => {
    try {
      set({ loading: true, error: null });
      await attendanceService.deleteAttendance(id);
      set((state) => ({
        attendanceRecords: state.attendanceRecords.filter(
          (record) => record.id !== id
        ),
        loading: false,
      }));
      return true;
    } catch (error) {
      const message =
        error instanceof AttendanceServiceError
          ? error.message
          : "Error al eliminar asistencia";
      set({ error: message, loading: false });
      return false;
    }
  },

  fetchAttendanceByStudent: async (idAlumno) => {
    try {
      set({ loading: true, error: null });
      const records = await attendanceService.getAttendanceByStudent(idAlumno);
      set((state) => {
        // Combinar las asistencias nuevas con las existentes, evitando duplicados
        const existingIds = new Set(state.attendanceRecords.map((r) => r.id));
        const uniqueNewRecords = records.filter((r) => !existingIds.has(r.id));

        return {
          attendanceRecords: [...state.attendanceRecords, ...uniqueNewRecords],
          loading: false,
        };
      });
    } catch (error) {
      const message =
        error instanceof AttendanceServiceError
          ? error.message
          : "Error al cargar asistencias del alumno";
      set({ error: message, loading: false });
    }
  },

  fetchAttendanceByDate: async (fecha) => {
    try {
      set({ loading: true, error: null });
      const records = await attendanceService.getAttendanceByDate(fecha);
      set((state) => {
        // Combinar las asistencias nuevas con las existentes, evitando duplicados
        const existingIds = new Set(state.attendanceRecords.map((r) => r.id));
        const uniqueNewRecords = records.filter((r) => !existingIds.has(r.id));

        return {
          attendanceRecords: [...state.attendanceRecords, ...uniqueNewRecords],
          loading: false,
        };
      });
    } catch (error) {
      const message =
        error instanceof AttendanceServiceError
          ? error.message
          : "Error al cargar asistencias por fecha";
      set({ error: message, loading: false });
    }
  },

  fetchAllAttendance: async () => {
    try {
      set({ loading: true, error: null });
      const records = await attendanceService.getAllAttendance();
      set({
        attendanceRecords: records,
        loading: false,
      });
    } catch (error) {
      const message =
        error instanceof AttendanceServiceError
          ? error.message
          : "Error al cargar todas las asistencias";
      set({ error: message, loading: false });
    }
  },

  getAttendancesByStudent: (idAlumno) => {
    return get().attendanceRecords.filter(
      (record) => record.idAlumno === idAlumno
    );
  },

  getAttendancesByDate: (fecha) => {
    // Convertir la fecha objetivo a objeto Date una vez
    const targetDate = parseISO(fecha);

    return get().attendanceRecords.filter((record) => {
      if (!record.fecha) return false;
      try {
        // Usar parseISO y isSameDay para comparación precisa de fechas
        const recordDate = parseISO(record.fecha);
        return isSameDay(recordDate, targetDate);
      } catch (error) {
        console.error("Error al procesar fecha:", error);
        return false;
      }
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));
