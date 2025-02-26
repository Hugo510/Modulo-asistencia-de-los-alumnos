import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, LoginCredentials } from "./types";
import { authService, AuthError } from "./services/authService";

// Define los tipos para los estados de carga y errores
interface LoadingState {
  login: boolean;
  resetPassword: boolean;
  verifyToken: boolean;
  updatePassword: boolean;
}

interface ErrorState {
  login: string | null;
  resetPassword: string | null;
  verifyToken: string | null;
  updatePassword: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  // Nuevos estados para manejo de UI
  loading: LoadingState;
  error: ErrorState;
  // Métodos
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  verifyResetToken: (token: string) => Promise<boolean>;
  updatePassword: (token: string, newPassword: string) => Promise<boolean>;
  // Métodos para limpiar errores
  clearErrors: () => void;
  clearError: (field: keyof ErrorState) => void;
}

// Estado inicial para loading y error
const initialLoadingState: LoadingState = {
  login: false,
  resetPassword: false,
  verifyToken: false,
  updatePassword: false,
};

const initialErrorState: ErrorState = {
  login: null,
  resetPassword: null,
  verifyToken: null,
  updatePassword: null,
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: initialLoadingState,
      error: initialErrorState,

      login: async (credentials: LoginCredentials) => {
        try {
          // Establecer estado de carga
          set((state) => ({
            loading: { ...state.loading, login: true },
            error: { ...state.error, login: null },
          }));

          // Verificar captcha
          if (!credentials.captchaToken) {
            set((state) => ({
              loading: { ...state.loading, login: false },
              error: {
                ...state.error,
                login: "Verificación captcha requerida",
              },
            }));
            return false;
          }

          // Usar el servicio de autenticación
          const { user, token } = await authService.login(credentials);

          // Actualizar estado en caso de éxito
          set({
            user,
            token,
            isAuthenticated: true,
            loading: { ...get().loading, login: false },
          });
          return true;
        } catch (error) {
          // Manejar el error de forma más específica
          let errorMessage = "Error desconocido durante el inicio de sesión";

          if (error instanceof AuthError) {
            // Usar mensajes específicos según el código de error
            switch (error.code) {
              case "INVALID_CREDENTIALS":
                errorMessage =
                  "Credenciales inválidas. Verifica tu correo y contraseña.";
                break;
              case "ACCOUNT_LOCKED":
                errorMessage =
                  "Tu cuenta ha sido bloqueada. Contacta al administrador.";
                break;
              case "CAPTCHA_FAILED":
                errorMessage =
                  "Verificación de seguridad fallida. Inténtalo de nuevo.";
                break;
              case "NETWORK_ERROR":
                errorMessage =
                  "No se pudo conectar al servidor. Verifica tu conexión a internet.";
                break;
              default:
                errorMessage = error.message || "Error de autenticación";
                break;
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          // Actualiza el estado con el error y desactiva loading
          set((state) => ({
            loading: { ...state.loading, login: false },
            error: { ...state.error, login: errorMessage },
          }));

          console.error("Login error:", error);
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          // Mantener los estados de loading y error
          loading: get().loading,
          error: get().error,
        });
      },

      resetPassword: async (email: string) => {
        try {
          // Establecer estado de carga
          set((state) => ({
            loading: { ...state.loading, resetPassword: true },
            error: { ...state.error, resetPassword: null },
          }));

          // Usar el servicio
          await authService.resetPassword(email);

          // Actualizar estado en caso de éxito
          set((state) => ({
            loading: { ...state.loading, resetPassword: false },
          }));

          return true;
        } catch (error) {
          // Manejar el error
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Error al solicitar restablecimiento de contraseña";

          set((state) => ({
            loading: { ...state.loading, resetPassword: false },
            error: { ...state.error, resetPassword: errorMessage },
          }));

          console.error("Password reset error:", error);
          return false;
        }
      },

      verifyResetToken: async (token: string) => {
        try {
          // Establecer estado de carga
          set((state) => ({
            loading: { ...state.loading, verifyToken: true },
            error: { ...state.error, verifyToken: null },
          }));

          // Usar el servicio
          const result = await authService.verifyResetToken(token);

          // Actualizar estado en caso de éxito
          set((state) => ({
            loading: { ...state.loading, verifyToken: false },
          }));

          return result;
        } catch (error) {
          // Manejar el error
          const errorMessage =
            error instanceof Error ? error.message : "Error al verificar token";

          set((state) => ({
            loading: { ...state.loading, verifyToken: false },
            error: { ...state.error, verifyToken: errorMessage },
          }));

          return false;
        }
      },

      updatePassword: async (token: string, newPassword: string) => {
        try {
          // Establecer estado de carga
          set((state) => ({
            loading: { ...state.loading, updatePassword: true },
            error: { ...state.error, updatePassword: null },
          }));

          // Usar el servicio
          const result = await authService.updatePassword(token, newPassword);

          // Actualizar estado en caso de éxito
          set((state) => ({
            loading: { ...state.loading, updatePassword: false },
          }));

          return result;
        } catch (error) {
          // Manejar el error
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Error al actualizar contraseña";

          set((state) => ({
            loading: { ...state.loading, updatePassword: false },
            error: { ...state.error, updatePassword: errorMessage },
          }));

          return false;
        }
      },

      // Métodos para limpiar errores
      clearErrors: () => {
        set({ error: initialErrorState });
      },

      clearError: (field: keyof ErrorState) => {
        set((state) => ({
          error: { ...state.error, [field]: null },
        }));
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // No persistir estados de loading y error
      }),
    }
  )
);
