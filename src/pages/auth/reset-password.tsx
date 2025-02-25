import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";

const requestResetSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
});

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
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { resetPassword, verifyResetToken, updatePassword } = useAuth();

  const { register: registerRequest, handleSubmit: handleSubmitRequest } =
    useForm<RequestResetForm>({
      resolver: zodResolver(requestResetSchema),
    });

  const { register: registerReset, handleSubmit: handleSubmitReset } =
    useForm<ResetPasswordForm>({
      resolver: zodResolver(resetPasswordSchema),
    });

  const onRequestReset = async (data: RequestResetForm) => {
    setIsLoading(true);
    setError("");
    try {
      const success = await resetPassword(data.email);
      if (success) {
        setSuccess(
          "Las instrucciones para restablecer la contraseña han sido enviadas a tu correo electrónico"
        );
      } else {
        setError("No se pudo procesar tu solicitud");
      }
    } catch (error) {
      setError("Ocurrió un error. Por favor, inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const onResetPassword = async (data: ResetPasswordForm) => {
    if (!token) return;

    setIsLoading(true);
    setError("");
    try {
      const isValid = await verifyResetToken(token);
      if (!isValid) {
        setError("Token de restablecimiento inválido o expirado");
        return;
      }

      const success = await updatePassword(token, data.password);
      if (success) {
        setSuccess("La contraseña ha sido restablecida exitosamente");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setError("No se pudo restablecer la contraseña");
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
