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
  alumnos?: Student[]; // Agregamos la propiedad opcional de alumnos
}

export interface GroupStudent {
  id: string;
  groupId: number;
  studentId: string;
  enrolledAt: string;
  status: "active" | "inactive";
}

// Actualizar la interfaz AttendanceRecord para reflejar el modelo real de la BD
export interface AttendanceRecord {
  id: number;
  idAlumno: number;
  fecha: string; // Manejaremos DateTime como string en formato ISO
  estado: string; // "presente", "ausente", "tarde"
  alumno?: Student; // Campo opcional que contiene los datos del alumno (solo en getAllAttendance)
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
