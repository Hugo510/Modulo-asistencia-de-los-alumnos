import api from "../api";
import type { AuthResponse, LoginCredentials } from "../types";

// Clase personalizada de error para autenticación
export class AuthError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "AuthError";
    this.status = status;
    this.code = code;
  }
}

export const authService = {
  /**
   * Iniciar sesión con credenciales
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // Transformar el campo email a correo para el backend
      const transformedCredentials = {
        correo: credentials.email, // Campo transformado
        password: credentials.password,
        captchaToken: credentials.captchaToken,
      };

      const response = await api.post<AuthResponse>(
        "/auth/login",
        transformedCredentials
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        // Error con respuesta del servidor
        const { status, data } = error.response;

        if (status === 401) {
          throw new AuthError(
            "Credenciales inválidas",
            status,
            "INVALID_CREDENTIALS"
          );
        } else if (status === 403) {
          throw new AuthError("Cuenta bloqueada", status, "ACCOUNT_LOCKED");
        } else if (status === 400 && data?.code === "CAPTCHA_FAILED") {
          throw new AuthError(
            "Verificación de captcha fallida",
            status,
            "CAPTCHA_FAILED"
          );
        } else {
          throw new AuthError(
            data?.message || "Error de autenticación",
            status,
            data?.code
          );
        }
      } else if (error.request) {
        // Error sin respuesta del servidor (problemas de red)
        throw new AuthError(
          "No se pudo conectar al servidor",
          undefined,
          "NETWORK_ERROR"
        );
      } else {
        // Error de configuración
        throw new AuthError(
          "Error al procesar la solicitud",
          undefined,
          "REQUEST_ERROR"
        );
      }
    }
  },

  /**
   * Solicitar restablecimiento de contraseña
   */
  resetPassword: async (email: string): Promise<boolean> => {
    try {
      // Transformar el campo email a correo
      await api.post("/auth/recover", { correo: email });
      return true;
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 404) {
          throw new AuthError(
            "Correo electrónico no encontrado",
            status,
            "EMAIL_NOT_FOUND"
          );
        } else if (status === 429) {
          throw new AuthError(
            "Demasiadas solicitudes. Intente más tarde",
            status,
            "RATE_LIMITED"
          );
        } else {
          throw new AuthError(
            data?.message || "Error al restablecer contraseña",
            status,
            data?.code
          );
        }
      } else {
        throw new AuthError(
          "No se pudo procesar la solicitud",
          undefined,
          "REQUEST_ERROR"
        );
      }
    }
  },

  /**
   * Verificar token de restablecimiento de contraseña
   */
  verifyResetToken: async (token: string): Promise<boolean> => {
    try {
      await api.post("/auth/verify-reset-token", { token });
      return true;
    } catch (error: any) {
      if (error.response) {
        const { status } = error.response;

        if (status === 400) {
          throw new AuthError(
            "Token inválido o expirado",
            status,
            "INVALID_TOKEN"
          );
        } else {
          throw new AuthError("Error al verificar token", status);
        }
      } else {
        throw new AuthError(
          "No se pudo verificar el token",
          undefined,
          "REQUEST_ERROR"
        );
      }
    }
  },

  /**
   * Actualizar contraseña con token de restablecimiento
   */
  updatePassword: async (
    token: string,
    newPassword: string
  ): Promise<boolean> => {
    try {
      await api.post("/auth/reset", { token, newPassword });
      return true;
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 && data?.code === "INVALID_TOKEN") {
          throw new AuthError(
            "Token inválido o expirado",
            status,
            "INVALID_TOKEN"
          );
        } else if (status === 400 && data?.code === "PASSWORD_REQUIREMENTS") {
          throw new AuthError(
            "La contraseña no cumple con los requisitos",
            status,
            "PASSWORD_REQUIREMENTS"
          );
        } else {
          throw new AuthError(
            data?.message || "Error al actualizar contraseña",
            status,
            data?.code
          );
        }
      } else {
        throw new AuthError(
          "No se pudo procesar la solicitud",
          undefined,
          "REQUEST_ERROR"
        );
      }
    }
  },
};
