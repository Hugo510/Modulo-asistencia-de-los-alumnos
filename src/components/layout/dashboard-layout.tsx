import { useState } from "react";
import { Link, useLocation, Navigate, Outlet } from "react-router-dom";
import {
  Users,
  BookOpen,
  Calendar,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

const navigation = [
  { name: "Grupos", href: "/dashboard/groups", icon: Users },
  { name: "Asistencia", href: "/dashboard/attendance", icon: Calendar },
  { name: "Estudiantes", href: "/dashboard/students", icon: BookOpen },
];

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const currentPath = location.pathname.split("/").filter(Boolean);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <span className="text-2xl font-bold text-blue-600">EduTrack</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                    location.pathname.startsWith(item.href)
                      ? "bg-gray-100 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex h-16 items-center px-4">
            <span className="text-2xl font-bold text-blue-600">EduTrack</span>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                    location.pathname.startsWith(item.href)
                      ? "bg-gray-100 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
          <Button
            variant="ghost"
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Breadcrumbs */}
          <div className="flex flex-1 items-center px-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <div className="flex items-center">
                    <Link
                      to="/dashboard"
                      className="text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      Panel de Control
                    </Link>
                  </div>
                </li>
                {currentPath.slice(1).map((path, index) => (
                  <li key={path}>
                    <div className="flex items-center">
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                      <Link
                        to={`/${currentPath.slice(0, index + 2).join("/")}`}
                        className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700 capitalize"
                      >
                        {path}
                      </Link>
                    </div>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          <div className="ml-4 flex items-center md:ml-6">
            <Button
              variant="ghost"
              className="rounded-full p-1"
              onClick={handleLogout}
            >
              <LogOut className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
