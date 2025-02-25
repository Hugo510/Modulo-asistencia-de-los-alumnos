import { useState } from "react";
import { format } from "date-fns";
import { Calendar, Clock, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import type { Student, AttendanceRecord } from "@/lib/types";

export function AttendancePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const {
    students,
    groups,
    getGroupStudents,
    markAttendance,
    getStudentAttendance,
  } = useStore();
  const today = new Date();
  const dateStr = format(today, "yyyy-MM-dd");

  const handleAttendanceChange = (
    studentId: string,
    status: AttendanceRecord["status"]
  ) => {
    markAttendance({
      studentId,
      groupId: selectedGroup,
      date: dateStr,
      status,
      recordedBy: "teacher",
    });
  };

  const filteredStudents = selectedGroup
    ? getGroupStudents(selectedGroup).filter((student) =>
        `${student.firstName} ${student.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : students.filter((student) =>
        `${student.firstName} ${student.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Asistencia</h1>
          <p className="mt-2 text-sm text-gray-700">
            Registra la asistencia de los estudiantes para la clase de hoy
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-900">
              {format(today, "MMMM d, yyyy")}
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <Clock className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-500">
              {format(today, "h:mm a")}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center mb-4 space-x-4">
          <div className="w-64">
            <label
              htmlFor="group"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Seleccionar Grupo
            </label>
            <select
              id="group"
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              <option value="">Todos los Estudiantes</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Buscar estudiantes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-hidden bg-white shadow sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredStudents.map((student) => {
              const attendance = getStudentAttendance(
                student.id,
                selectedGroup,
                dateStr
              );
              return (
                <li key={student.id}>
                  <div className="flex items-center px-4 py-4 sm:px-6">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-blue-600">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {student.studentId}
                        </p>
                      </div>
                    </div>
                    <div className="ml-5 flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant={
                          attendance?.status === "present"
                            ? "primary"
                            : "outline"
                        }
                        onClick={() =>
                          handleAttendanceChange(student.id, "present")
                        }
                        className="w-24"
                      >
                        Presente
                      </Button>
                      <Button
                        size="sm"
                        variant={
                          attendance?.status === "late" ? "primary" : "outline"
                        }
                        onClick={() =>
                          handleAttendanceChange(student.id, "late")
                        }
                        className="w-24"
                      >
                        Tarde
                      </Button>
                      <Button
                        size="sm"
                        variant={
                          attendance?.status === "absent"
                            ? "primary"
                            : "outline"
                        }
                        onClick={() =>
                          handleAttendanceChange(student.id, "absent")
                        }
                        className="w-24"
                      >
                        Ausente
                      </Button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
