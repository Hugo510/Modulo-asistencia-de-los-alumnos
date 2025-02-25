export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "teacher" | "admin";
  createdAt: string;
  lastLogin?: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  enrollmentDate: string;
  active: boolean;
}

export interface Group {
  id: string;
  name: string;
  course: string;
  teacherId: string;
  academicPeriod: string;
  createdAt: string;
  active: boolean;
}

export interface GroupStudent {
  id: string;
  groupId: string;
  studentId: string;
  enrolledAt: string;
  status: "active" | "inactive";
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  groupId: string;
  date: string;
  status: "present" | "absent" | "late";
  notes?: string;
  recordedBy: string;
  recordedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  captchaToken: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface PasswordReset {
  email: string;
  token?: string;
  newPassword?: string;
}
