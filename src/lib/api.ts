import axios from "axios";
import { useAuth } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://tu-api.com",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el token de autenticación a las solicitudes
api.interceptors.request.use(
  (config) => {
    // Obtener el token directamente del store de Zustand
    const token = useAuth.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si recibimos un 401 (No autorizado) en una ruta que no sea login,
    // solo entonces deslogueamos al usuario
    if (error.response && error.response.status === 401) {
      const isLoginRequest = error.config?.url?.includes("/auth/login");

      // No redireccionar si es un error en la petición de login
      if (!isLoginRequest) {
        // Usar el método logout del store directamente
        useAuth.getState().logout();
        // Redirigir a la página de login
        window.location.href = "/login";
      }
    }

    // Importante: siempre rechazar la promesa para que el error sea manejado localmente
    return Promise.reject(error);
  }
);

export default api;
