import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
} from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage = "Ha ocurrido un error inesperado.";
  let errorCode = "500";

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText;
    errorCode = String(error.status);
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
        <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
          Error {errorCode}
        </h1>
        <p className="mt-2 text-sm text-gray-600">{errorMessage}</p>
        <div className="mt-6">
          <Button onClick={() => navigate(-1)} className="mr-4">
            Regresar
          </Button>
          <Button variant="outline" onClick={() => navigate("/")}>
            Ir al inicio de sesión
          </Button>
        </div>
      </div>
    </div>
  );
}
