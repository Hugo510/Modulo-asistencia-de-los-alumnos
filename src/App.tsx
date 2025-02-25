import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginPage } from "@/pages/auth/login";
import { ResetPasswordPage } from "@/pages/auth/reset-password";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GroupsPage } from "@/pages/dashboard/groups";
import { AttendancePage } from "@/pages/dashboard/attendance";
import { StudentsPage } from "@/pages/dashboard/students";
import { ErrorPage } from "@/pages/error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "groups",
        element: <GroupsPage />,
      },
      {
        path: "attendance",
        element: <AttendancePage />,
      },
      {
        path: "students",
        element: <StudentsPage />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
