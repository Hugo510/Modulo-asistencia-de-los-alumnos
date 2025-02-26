import { create } from "zustand";
import { groupService, GroupServiceError } from "./services/groupService";
import type { Group, Student, AttendanceRecord } from "./types";

// Definición de tipos para estados de carga y errores
interface LoadingState {
  groups: boolean;
  groupDetails: boolean;
  students: boolean;
  attendance: boolean;
  createGroup: boolean;
  updateGroup: boolean;
  deleteGroup: boolean;
  addStudent: boolean;
  registerAttendance: boolean;
}

interface ErrorState {
  groups: string | null;
  groupDetails: string | null;
  students: string | null;
  attendance: string | null;
  createGroup: string | null;
  updateGroup: string | null;
  deleteGroup: string | null;
  addStudent: string | null;
  registerAttendance: string | null;
}

// Definición del estado global de la aplicación
interface AppState {
  // Datos
  groups: Group[];
  selectedGroup: Group | null;
  students: Record<string, Student[]>; // Estudiantes agrupados por groupId
  attendanceRecords: Record<string, AttendanceRecord[]>; // Asistencias agrupadas por fecha-groupId

  // Estados de UI
  loading: LoadingState;
  error: ErrorState;

  // Acciones
  fetchGroups: () => Promise<void>;
  fetchGroupById: (id: number) => Promise<void>;
  fetchGroupStudents: (groupId: number) => Promise<void>;
  fetchAttendanceByDate: (groupId: number, date: string) => Promise<void>;

  addGroup: (
    groupData: Omit<Group, "id" | "createdAt" | "active">
  ) => Promise<Group | null>;
  updateGroup: (id: number, groupData: Partial<Group>) => Promise<boolean>;
  deleteGroup: (id: number) => Promise<boolean>;

  addStudentToGroup: (groupId: number, studentId: string) => Promise<boolean>;
  registerAttendance: (
    attendanceData: Omit<AttendanceRecord, "id" | "recordedAt">
  ) => Promise<boolean>;

  // Selectores
  getGroupById: (id: number) => Group | null;
  getGroupStudents: (groupId: number) => Student[];

  // Utilidades
  clearErrors: () => void;
  clearError: (field: keyof ErrorState) => void;
  reset: () => void;
}

// Estados iniciales
const initialLoadingState: LoadingState = {
  groups: false,
  groupDetails: false,
  students: false,
  attendance: false,
  createGroup: false,
  updateGroup: false,
  deleteGroup: false,
  addStudent: false,
  registerAttendance: false,
};

const initialErrorState: ErrorState = {
  groups: null,
  groupDetails: null,
  students: null,
  attendance: null,
  createGroup: null,
  updateGroup: null,
  deleteGroup: null,
  addStudent: null,
  registerAttendance: null,
};

// Implementación del store
export const useStore = create<AppState>((set, get) => ({
  // Estado inicial
  groups: [],
  selectedGroup: null,
  students: {},
  attendanceRecords: {},
  loading: initialLoadingState,
  error: initialErrorState,

  // Acciones
  fetchGroups: async () => {
    try {
      set((state) => ({
        loading: { ...state.loading, groups: true },
        error: { ...state.error, groups: null },
      }));

      const groups = await groupService.getAllGroups();

      set((state) => ({
        groups,
        loading: { ...state.loading, groups: false },
      }));
    } catch (error) {
      const errorMessage =
        error instanceof GroupServiceError
          ? error.message
          : "Error al cargar los grupos";

      set((state) => ({
        loading: { ...state.loading, groups: false },
        error: { ...state.error, groups: errorMessage },
      }));

      console.error("Error fetching groups:", error);
    }
  },

  fetchGroupById: async (id: number) => {
    try {
      set((state) => ({
        loading: { ...state.loading, groupDetails: true },
        error: { ...state.error, groupDetails: null },
      }));

      const group = await groupService.getGroupById(id);

      set((state) => ({
        selectedGroup: group,
        loading: { ...state.loading, groupDetails: false },
      }));
    } catch (error) {
      const errorMessage =
        error instanceof GroupServiceError
          ? error.message
          : `Error al cargar el grupo ${id}`;

      set((state) => ({
        loading: { ...state.loading, groupDetails: false },
        error: { ...state.error, groupDetails: errorMessage },
      }));

      console.error(`Error fetching group ${id}:`, error);
    }
  },

  fetchGroupStudents: async (groupId: number) => {
    try {
      set((state) => ({
        loading: { ...state.loading, students: true },
        error: { ...state.error, students: null },
      }));

      const students = await groupService.getGroupStudents(groupId);

      set((state) => ({
        students: {
          ...state.students,
          [groupId]: students,
        },
        loading: { ...state.loading, students: false },
      }));
    } catch (error) {
      const errorMessage =
        error instanceof GroupServiceError
          ? error.message
          : `Error al cargar estudiantes del grupo ${groupId}`;

      set((state) => ({
        loading: { ...state.loading, students: false },
        error: { ...state.error, students: errorMessage },
      }));

      console.error(`Error fetching students for group ${groupId}:`, error);
    }
  },

  fetchAttendanceByDate: async (groupId: number, date: string) => {
    try {
      set((state) => ({
        loading: { ...state.loading, attendance: true },
        error: { ...state.error, attendance: null },
      }));

      const records = await groupService.getAttendanceByDate(groupId, date);
      const key = `${date}-${groupId}`;

      set((state) => ({
        attendanceRecords: {
          ...state.attendanceRecords,
          [key]: records,
        },
        loading: { ...state.loading, attendance: false },
      }));
    } catch (error) {
      const errorMessage =
        error instanceof GroupServiceError
          ? error.message
          : `Error al cargar asistencias para la fecha ${date}`;

      set((state) => ({
        loading: { ...state.loading, attendance: false },
        error: { ...state.error, attendance: errorMessage },
      }));

      console.error(
        `Error fetching attendance for group ${groupId} on date ${date}:`,
        error
      );
    }
  },

  addGroup: async (groupData) => {
    try {
      set((state) => ({
        loading: { ...state.loading, createGroup: true },
        error: { ...state.error, createGroup: null },
      }));

      const newGroup = await groupService.createGroup(groupData);

      set((state) => ({
        groups: [...state.groups, newGroup],
        loading: { ...state.loading, createGroup: false },
      }));

      return newGroup;
    } catch (error) {
      const errorMessage =
        error instanceof GroupServiceError
          ? error.message
          : "Error al crear el grupo";

      set((state) => ({
        loading: { ...state.loading, createGroup: false },
        error: { ...state.error, createGroup: errorMessage },
      }));

      console.error("Error creating group:", error);
      return null;
    }
  },

  updateGroup: async (id: number, groupData) => {
    try {
      set((state) => ({
        loading: { ...state.loading, updateGroup: true },
        error: { ...state.error, updateGroup: null },
      }));

      const updatedGroup = await groupService.updateGroup(id, groupData);

      set((state) => ({
        groups: state.groups.map((g) => (g.id === id ? updatedGroup : g)),
        selectedGroup:
          state.selectedGroup?.id === id ? updatedGroup : state.selectedGroup,
        loading: { ...state.loading, updateGroup: false },
      }));

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof GroupServiceError
          ? error.message
          : `Error al actualizar el grupo ${id}`;

      set((state) => ({
        loading: { ...state.loading, updateGroup: false },
        error: { ...state.error, updateGroup: errorMessage },
      }));

      console.error(`Error updating group ${id}:`, error);
      return false;
    }
  },

  deleteGroup: async (id: number) => {
    try {
      set((state) => ({
        loading: { ...state.loading, deleteGroup: true },
        error: { ...state.error, deleteGroup: null },
      }));

      await groupService.deleteGroup(id);

      set((state) => ({
        groups: state.groups.filter((g) => g.id !== id),
        selectedGroup:
          state.selectedGroup?.id === id ? null : state.selectedGroup,
        loading: { ...state.loading, deleteGroup: false },
      }));

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof GroupServiceError
          ? error.message
          : `Error al eliminar el grupo ${id}`;

      set((state) => ({
        loading: { ...state.loading, deleteGroup: false },
        error: { ...state.error, deleteGroup: errorMessage },
      }));

      console.error(`Error deleting group ${id}:`, error);
      return false;
    }
  },

  addStudentToGroup: async (groupId: number, studentId) => {
    try {
      set((state) => ({
        loading: { ...state.loading, addStudent: true },
        error: { ...state.error, addStudent: null },
      }));

      await groupService.addStudentToGroup(groupId, studentId);

      // Recargar los estudiantes para este grupo
      await get().fetchGroupStudents(groupId);

      set((state) => ({
        loading: { ...state.loading, addStudent: false },
      }));

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof GroupServiceError
          ? error.message
          : "Error al añadir estudiante al grupo";

      set((state) => ({
        loading: { ...state.loading, addStudent: false },
        error: { ...state.error, addStudent: errorMessage },
      }));

      console.error("Error adding student to group:", error);
      return false;
    }
  },

  registerAttendance: async (attendanceData) => {
    try {
      set((state) => ({
        loading: { ...state.loading, registerAttendance: true },
        error: { ...state.error, registerAttendance: null },
      }));

      await groupService.registerAttendance(attendanceData);

      // Recargar los registros de asistencia para la fecha actual
      const key = `${attendanceData.date}-${attendanceData.groupId}`;
      if (state.attendanceRecords[key]) {
        await get().fetchAttendanceByDate(
          attendanceData.groupId,
          attendanceData.date
        );
      }

      set((state) => ({
        loading: { ...state.loading, registerAttendance: false },
      }));

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof GroupServiceError
          ? error.message
          : "Error al registrar asistencia";

      set((state) => ({
        loading: { ...state.loading, registerAttendance: false },
        error: { ...state.error, registerAttendance: errorMessage },
      }));

      console.error("Error registering attendance:", error);
      return false;
    }
  },

  // Selectores
  getGroupById: (id: number) => {
    return get().groups.find((g) => g.id === id) || null;
  },

  getGroupStudents: (groupId: number) => {
    return get().students[groupId] || [];
  },

  // Utilidades
  clearErrors: () => {
    set({ error: initialErrorState });
  },

  clearError: (field) => {
    set((state) => ({
      error: { ...state.error, [field]: null },
    }));
  },

  reset: () => {
    set({
      groups: [],
      selectedGroup: null,
      students: {},
      attendanceRecords: {},
      loading: initialLoadingState,
      error: initialErrorState,
    });
  },
}));
