import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { format, parseISO, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { useAttendanceStore } from "@/lib/storeAttendance";
import type { AttendanceRecord } from "@/lib/types";

// Componente memorizado para cada fila de asistencia
const AttendanceRow = memo(({
  record,
  onStatusChange
}: {
  record: AttendanceRecord,
  onStatusChange: (idAlumno: number, estado: string) => void
}) => {
  const student = record.alumno;
  if (!student) return null;

  return (
    <li key={record.id}>
      <div className="flex items-center px-4 py-4 sm:px-6">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-blue-600">
              {student.nombre} {student.apellido}
            </p>
          </div>
          <div className="mt-1">
            <p className="text-xs text-gray-500">{student.correo}</p>
          </div>
        </div>
        <div className="ml-5 flex items-center space-x-2">
          <Button
            size="sm"
            variant={record.estado === "presente" ? "secondary" : "outline"}
            onClick={() => onStatusChange(record.idAlumno, "presente")}
            className="w-24"
          >
            Presente
          </Button>
          <Button
            size="sm"
            variant={record.estado === "tarde" ? "ghost" : "outline"}
            onClick={() => onStatusChange(record.idAlumno, "tarde")}
            className="w-24"
          >
            Tarde
          </Button>
          <Button
            size="sm"
            variant={record.estado === "ausente" ? "ghost" : "outline"}
            onClick={() => onStatusChange(record.idAlumno, "ausente")}
            className="w-24"
          >
            Ausente
          </Button>
        </div>
      </div>
    </li>
  );
});
AttendanceRow.displayName = 'AttendanceRow';

// Componente principal
export function AttendancePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<number | "">("");
  const [dataLoaded, setDataLoaded] = useState(false);

  // Memoizar la creación del objeto Date para evitar recrearlo en cada renderizado
  const today = useMemo(() => new Date(), []);
  const isoDate = useMemo(() => today.toISOString(), [today]);
  const dateStr = useMemo(() => format(today, "yyyy-MM-dd"), [today]);
  const formattedDate = useMemo(() => format(today, "d 'de' MMMM, yyyy", { locale: es }), [today]);
  const formattedTime = useMemo(() => format(today, "h:mm a"), [today]);

  // Memoizar selectores para evitar re-renders innecesarios  
  const { groups, fetchGroups } = useStore(
    useCallback((state) => ({
      groups: state.groups,
      fetchGroups: state.fetchGroups
    }), [])
  );

  const {
    attendanceRecords,
    registerAttendance,
    fetchAllAttendance
  } = useAttendanceStore(
    useCallback((state) => ({
      attendanceRecords: state.attendanceRecords,
      registerAttendance: state.registerAttendance,
      fetchAllAttendance: state.fetchAllAttendance
    }), [])
  );

  // Cargar datos solo una vez
  useEffect(() => {
    if (!dataLoaded) {
      const loadData = async () => {
        await Promise.all([
          fetchGroups(),
          fetchAllAttendance()
        ]);
        setDataLoaded(true);
      };

      loadData();
    }
  }, [fetchGroups, fetchAllAttendance, dataLoaded]);

  // Memoizar la función handleAttendanceChange
  const handleAttendanceChange = useCallback(async (idAlumno: number, estado: string) => {
    await registerAttendance({
      idAlumno,
      fecha: isoDate,
      estado
    });
  }, [registerAttendance, isoDate]);

  // Memoizar los resultados filtrados para evitar recálculos innecesarios
  const filteredAttendanceRecords = useMemo(() => {
    if (attendanceRecords.length === 0) {
      return [];
    }

    // Crear objeto Date una sola vez para comparar
    const todayDate = parseISO(dateStr);

    // Filtrar por fecha usando date-fns
    const todayAttendances = attendanceRecords.filter(record => {
      if (!record.fecha) return false;
      try {
        // Usar parseISO para convertir la fecha a objeto Date y isSameDay para comparar
        const recordDate = parseISO(record.fecha);
        return isSameDay(recordDate, todayDate);
      } catch (error) {
        console.error("Error al procesar fecha:", error);
        return false;
      }
    });

    // Filtrar por grupo
    let result = todayAttendances;
    if (selectedGroupId !== "") {
      const selectedGroup = groups.find(g => g.id === selectedGroupId);
      const groupStudentIds = selectedGroup?.alumnos?.map(student => student.id) || [];

      result = todayAttendances.filter(record =>
        groupStudentIds.includes(record.idAlumno)
      );
    }

    // Filtrar por término de búsqueda
    if (searchTerm.trim() !== "") {
      result = result.filter(record => {
        if (!record.alumno) return false;

        const fullName = `${record.alumno.nombre} ${record.alumno.apellido}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      });
    }

    return result;
  }, [attendanceRecords, dateStr, selectedGroupId, groups, searchTerm]);

  // Memoizar los selectores de grupos para evitar recrearlos en cada render
  const groupOptions = useMemo(() => {
    return groups.map(group => (
      <option key={group.id} value={group.id}>
        {group.nombre}
      </option>
    ));
  }, [groups]);

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
              {formattedDate}
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <Clock className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-500">{formattedTime}</span>
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
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value ? parseInt(e.target.value) : "")}
            >
              <option value="">Todos los Estudiantes</option>
              {groupOptions}
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
          {!dataLoaded ? (
            <div className="p-4 text-center text-gray-500">
              Cargando datos de asistencia...
            </div>
          ) : filteredAttendanceRecords.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredAttendanceRecords.map((record) => (
                <AttendanceRow
                  key={record.id}
                  record={record}
                  onStatusChange={handleAttendanceChange}
                />
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No hay registros de asistencia para mostrar. Selecciona un grupo o ajusta tu búsqueda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
