import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { Student, Group, GroupStudent, AttendanceRecord } from "./types";

interface StoreState {
  students: Student[];
  groups: Group[];
  groupStudents: GroupStudent[];
  attendance: AttendanceRecord[];
  addStudent: (
    student: Omit<Student, "id" | "enrollmentDate" | "active">,
    groupId: string
  ) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  addGroup: (group: Omit<Group, "id" | "createdAt" | "active">) => void;
  updateGroup: (id: string, group: Partial<Group>) => void;
  addStudentToGroup: (groupId: string, studentId: string) => void;
  removeStudentFromGroup: (groupId: string, studentId: string) => void;
  markAttendance: (record: Omit<AttendanceRecord, "id" | "recordedAt">) => void;
  updateAttendance: (id: string, record: Partial<AttendanceRecord>) => void;
  getGroupStudents: (groupId: string) => Student[];
  getStudentGroups: (studentId: string) => Group[];
  getStudentAttendance: (
    studentId: string,
    groupId: string,
    date: string
  ) => AttendanceRecord | undefined;
  getGroupAttendance: (groupId: string, date: string) => AttendanceRecord[];
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      students: [
        {
          id: "1",
          firstName: "Alice",
          lastName: "Johnson",
          email: "alice@example.com",
          studentId: "STU001",
          enrollmentDate: "2024-01-01",
          active: true,
        },
        {
          id: "2",
          firstName: "Bob",
          lastName: "Smith",
          email: "bob@example.com",
          studentId: "STU002",
          enrollmentDate: "2024-01-01",
          active: true,
        },
      ],
      groups: [
        {
          id: "1",
          name: "Mathematics 101",
          course: "Basic Mathematics",
          teacherId: "1",
          academicPeriod: "2024-1",
          createdAt: "2024-01-01",
          active: true,
        },
      ],
      groupStudents: [
        {
          id: "1",
          groupId: "1",
          studentId: "1",
          enrolledAt: "2024-01-01",
          status: "active",
        },
        {
          id: "2",
          groupId: "1",
          studentId: "2",
          enrolledAt: "2024-01-01",
          status: "active",
        },
      ],
      attendance: [],

      addStudent: (student, groupId) => {
        const newStudent = {
          ...student,
          id: uuidv4(),
          enrollmentDate: new Date().toISOString(),
          active: true,
        };
        set((state) => ({
          students: [...state.students, newStudent],
          groupStudents: [
            ...state.groupStudents,
            {
              id: uuidv4(),
              groupId,
              studentId: newStudent.id,
              enrolledAt: new Date().toISOString(),
              status: "active",
            },
          ],
        }));
      },

      updateStudent: (id, student) => {
        set((state) => ({
          students: state.students.map((s) =>
            s.id === id ? { ...s, ...student } : s
          ),
        }));
      },

      addGroup: (group) => {
        set((state) => ({
          groups: [
            ...state.groups,
            {
              ...group,
              id: uuidv4(),
              createdAt: new Date().toISOString(),
              active: true,
            },
          ],
        }));
      },

      updateGroup: (id, group) => {
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === id ? { ...g, ...group } : g
          ),
        }));
      },

      addStudentToGroup: (groupId, studentId) => {
        set((state) => ({
          groupStudents: [
            ...state.groupStudents,
            {
              id: uuidv4(),
              groupId,
              studentId,
              enrolledAt: new Date().toISOString(),
              status: "active",
            },
          ],
        }));
      },

      removeStudentFromGroup: (groupId, studentId) => {
        set((state) => ({
          groupStudents: state.groupStudents.map((gs) =>
            gs.groupId === groupId && gs.studentId === studentId
              ? { ...gs, status: "inactive" }
              : gs
          ),
        }));
      },

      markAttendance: (record) => {
        set((state) => ({
          attendance: [
            ...state.attendance,
            {
              ...record,
              id: uuidv4(),
              recordedAt: new Date().toISOString(),
            },
          ],
        }));
      },

      updateAttendance: (id, record) => {
        set((state) => ({
          attendance: state.attendance.map((a) =>
            a.id === id ? { ...a, ...record } : a
          ),
        }));
      },

      getGroupStudents: (groupId) => {
        const state = get();
        const activeEnrollments = state.groupStudents.filter(
          (gs) => gs.groupId === groupId && gs.status === "active"
        );
        return state.students.filter((student) =>
          activeEnrollments.some((e) => e.studentId === student.id)
        );
      },

      getStudentGroups: (studentId) => {
        const state = get();
        const activeEnrollments = state.groupStudents.filter(
          (gs) => gs.studentId === studentId && gs.status === "active"
        );
        return state.groups.filter((group) =>
          activeEnrollments.some((e) => e.groupId === group.id)
        );
      },

      getStudentAttendance: (studentId, groupId, date) => {
        const state = get();
        return state.attendance.find(
          (record) =>
            record.studentId === studentId &&
            record.groupId === groupId &&
            record.date === date
        );
      },

      getGroupAttendance: (groupId, date) => {
        const state = get();
        return state.attendance.filter(
          (record) => record.groupId === groupId && record.date === date
        );
      },
    }),
    {
      name: "attendance-store",
    }
  )
);
