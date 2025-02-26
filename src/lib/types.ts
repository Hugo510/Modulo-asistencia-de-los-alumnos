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
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
}

export interface Group {
  id: number;
  nombre: string;
  idUsuario: number;
}

export interface GroupStudent {
  id: string;
  groupId: number;
  studentId: string;
  enrolledAt: string;
  status: "active" | "inactive";
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  groupId: number;
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
