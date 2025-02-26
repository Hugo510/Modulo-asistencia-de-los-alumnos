import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";

// Esquema para solicitar restablecimiento (ingresar correo)
const requestResetSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
});

// Esquema para reiniciar contraseña (ingresar nueva contraseña y confirmación)
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RequestResetForm = z.infer<typeof requestResetSchema>;
type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordPage() {
  // Extrae el token de la URL (por ejemplo, ?token=...)
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // De nuestro hook useAuth usamos resetPassword y updatePassword
  const { resetPassword, updatePassword } = useAuth();

  // Form para solicitar restablecimiento (ingresar correo)
  const { register: registerRequest, handleSubmit: handleSubmitRequest } =
    useForm<RequestResetForm>({
      resolver: zodResolver(requestResetSchema),
    });

  // Form para reiniciar contraseña (ingresar nueva contraseña y confirmación)
  const { register: registerReset, handleSubmit: handleSubmitReset } =
    useForm<ResetPasswordForm>({
      resolver: zodResolver(resetPasswordSchema),
    });

  // Función que se llama al solicitar restablecimiento de contraseña (envía el correo)
  const onRequestReset = async (data: RequestResetForm) => {
    setIsLoading(true);
    setError("");
    try {
      const success = await resetPassword(data.email);
      if (success) {
        setSuccess(
          "Las instrucciones para restablecer la contraseña han sido enviadas a tu correo electrónico."
        );
      } else {
        setError("No se pudo procesar tu solicitud.");
      }
    } catch (error) {
      setError("Ocurrió un error. Por favor, inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // Función que se llama al enviar el formulario de reinicio de contraseña
  const onResetPassword = async (data: ResetPasswordForm) => {
    if (!token) return;

    setIsLoading(true);
    setError("");
    try {
      // Llama directamente a updatePassword sin verificar el token previamente.
      const success = await updatePassword(token, data.password);
      if (success) {
        setSuccess("La contraseña ha sido restablecida exitosamente.");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setError("No se pudo restablecer la contraseña.");
      }
    } catch (error) {
      setError("Ocurrió un error. Por favor, inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Lock className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {token
            ? "Restablece tu contraseña"
            : "Solicitar restablecimiento de contraseña"}
        </h2>
        {error && (
          <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded text-center">
            {success}
          </div>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {token ? (
            <form
              className="space-y-6"
              onSubmit={handleSubmitReset(onResetPassword)}
            >
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nueva contraseña
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    className="pl-10"
                    placeholder="Introduce la nueva contraseña"
                    {...registerReset("password")}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirmar contraseña
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="pl-10"
                    placeholder="Confirma la nueva contraseña"
                    {...registerReset("confirmPassword")}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? "Restableciendo contraseña..."
                  : "Restablecer contraseña"}
              </Button>
            </form>
          ) : (
            <form
              className="space-y-6"
              onSubmit={handleSubmitRequest(onRequestReset)}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Correo electrónico
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    className="pl-10"
                    placeholder="Introduce tu correo electrónico"
                    {...registerRequest("email")}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? "Enviando instrucciones..."
                  : "Enviar instrucciones de restablecimiento"}
              </Button>
            </form>
          )}

          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              className="text-sm text-blue-600 hover:text-blue-500"
              onClick={() => navigate("/")}
            >
              Volver al inicio de sesión
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


/* 
  Explicación
    Extracción del Token:
      Se utiliza useSearchParams para extraer el parámetro token de la URL. Si existe, se muestra el formulario para reiniciar la contraseña; de lo contrario, se muestra el formulario para solicitar el restablecimiento.

    Formulario para Reinicio de Contraseña:
      Al enviar el formulario, se llama a onResetPassword, que ahora omite la validación del token (ya que no se implementa verifyResetToken) y procede directamente a llamar a updatePassword con el token y la nueva contraseña.

    Interfaz de Usuario:
      Los mensajes de error, éxito y la animación de carga se manejan con estados locales para ofrecer retroalimentación al usuario.
*/