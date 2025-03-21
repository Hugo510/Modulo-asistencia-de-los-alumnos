import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { format, isValid } from "date-fns";
import { Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateFilter } from "@/components/date-filter";
import { useStore } from "@/lib/store";
import { useAttendanceStore } from "@/lib/storeAttendance";
import type { AttendanceRecord, Student } from "@/lib/types";

// Componente memorizado para cada fila de asistencia
const AttendanceRow = memo(
  ({
    student,
    attendanceRecord,
    onStatusChange,
  }: {
    student: Student;
    attendanceRecord?: AttendanceRecord;
    onStatusChange: (idAlumno: number, estado: string, recordId?: number) => void;
  }) => {
    // Determinar si el estudiante ya tiene un registro de asistencia
    const hasAttendance = !!attendanceRecord;
    // Normalizar el estado actual para trabajar con valores estandarizados
    const normalizeStatus = (status: string): string => {
      const lowerStatus = status.toLowerCase();
      if (lowerStatus.includes('tarde') || lowerStatus === 'tardanza') return 'tardanza';
      if (lowerStatus === 'ausente' || lowerStatus === 'au') return 'ausente';
      if (lowerStatus === 'presente') return 'presente';
      return '';
    };

    // Obtener el estado actual normalizado o un valor vacío si no hay registro
    const currentStatus = hasAttendance ? normalizeStatus(attendanceRecord.estado) : '';

    // Función para manejar los clics en los botones de estado
    const handleStatusClick = useCallback((estado: string) => {
      if (currentStatus === estado) return; // No hacer nada si es el mismo estado
      onStatusChange(student.id, estado, attendanceRecord?.id);
    }, [student.id, currentStatus, attendanceRecord?.id, onStatusChange]);

    return (
      <li>
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
              variant={currentStatus === "presente" ? "secondary" : "outline"}
              onClick={() => handleStatusClick("presente")}
              disabled={currentStatus === "presente"}
              className="w-24"
            >
              Presente
            </Button>
            <Button
              size="sm"
              variant={currentStatus === "tardanza" ? "secondary" : "outline"}
              onClick={() => handleStatusClick("tardanza")}
              disabled={currentStatus === "tardanza"}
              className="w-24"
            >
              Tarde
            </Button>
            <Button
              size="sm"
              variant={currentStatus === "ausente" ? "secondary" : "outline"}
              onClick={() => handleStatusClick("ausente")}
              disabled={currentStatus === "ausente"}
              className="w-24"
            >
              Ausente
            </Button>
          </div>
        </div>
      </li>
    );
  }
);
AttendanceRow.displayName = "AttendanceRow";

// Componente principal
export function AttendancePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<number | "">("");
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Memoizar la creación del objeto Date para evitar recrearlo en cada renderizado
  const isoDate = useMemo(() => selectedDate.toISOString(), [selectedDate]);
  const dateStr = useMemo(() => format(selectedDate, "yyyy-MM-dd"), [selectedDate]);
  const formattedTime = useMemo(() => format(selectedDate, "h:mm a"), [selectedDate]);

  // Memoizar selectores para evitar re-renders innecesarios
  const { groups, fetchGroups, getGroupStudents } = useStore(
    useCallback(
      (state) => ({
        groups: state.groups,
        fetchGroups: state.fetchGroups,
        getGroupStudents: state.getGroupStudents,
      }),
      []
    )
  );

  const {
    attendanceRecords,
    registerAttendance,
    updateAttendance,
    fetchAllAttendance,
    getAttendancesByDate
  } = useAttendanceStore(
    useCallback(
      (state) => ({
        attendanceRecords: state.attendanceRecords,
        registerAttendance: state.registerAttendance,
        updateAttendance: state.updateAttendance,
        fetchAllAttendance: state.fetchAllAttendance,
        getAttendancesByDate: state.getAttendancesByDate,
      }),
      []
    )
  );

  // Cargar datos solo una vez
  useEffect(() => {
    if (!dataLoaded) {
      const loadData = async () => {
        await Promise.all([fetchGroups(), fetchAllAttendance()]);
        setDataLoaded(true);
      };

      loadData();
    }
  }, [fetchGroups, fetchAllAttendance, dataLoaded]);

  // Manejar cambios de fecha
  const handleDateChange = useCallback((newDate: Date) => {
    if (isValid(newDate)) {
      setSelectedDate(newDate);
    }
  }, []);

  // Función para manejar los cambios de estado de asistencia
  const handleAttendanceChange = useCallback(
    async (idAlumno: number, estado: string, recordId?: number) => {
      if (recordId) {
        // Si ya existe un registro, actualizar (PUT)
        await updateAttendance(recordId, {
          idAlumno,
          fecha: isoDate, // Usa la fecha seleccionada
          estado,
        });
      } else {
        // Si no existe un registro, crear uno nuevo (POST)
        await registerAttendance({
          idAlumno,
          fecha: isoDate, // Usa la fecha seleccionada
          estado,
        });
      }
    },
    [registerAttendance, updateAttendance, isoDate]
  );

  // Obtener todos los estudiantes según filtros aplicados
  const filteredStudents = useMemo(() => {
    let students: Student[] = [];

    // Si hay un grupo seleccionado, obtener estudiantes de ese grupo
    if (selectedGroupId !== "") {
      students = getGroupStudents(selectedGroupId as number);
    } else {
      // Si no hay grupo seleccionado, obtener estudiantes de todos los grupos
      // usando un Map para eliminar duplicados
      const uniqueStudentsMap = new Map<number, Student>();

      groups.forEach(group => {
        if (group.alumnos) {
          group.alumnos.forEach(student => {
            uniqueStudentsMap.set(student.id, student);
          });
        }
      });

      // Convertir el Map a un array
      students = Array.from(uniqueStudentsMap.values());
    }

    // Filtrar por término de búsqueda si existe
    if (searchTerm.trim() !== "") {
      students = students.filter((student) => {
        const fullName = `${student.nombre} ${student.apellido}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      });
    }

    return students;
  }, [groups, selectedGroupId, searchTerm, getGroupStudents]);

  // Obtener los registros de asistencia para la fecha seleccionada
  const selectedDateAttendanceRecords = useMemo(() => {
    return getAttendancesByDate(dateStr);
  }, [getAttendancesByDate, dateStr, attendanceRecords]);

  // Combinar estudiantes con sus registros de asistencia correspondientes
  const studentsWithAttendance = useMemo(() => {
    return filteredStudents.map(student => {
      // Buscar si el estudiante tiene un registro de asistencia para la fecha seleccionada
      const attendanceRecord = selectedDateAttendanceRecords.find(
        record => record.idAlumno === student.id
      );

      return {
        student,
        attendanceRecord
      };
    });
  }, [filteredStudents, selectedDateAttendanceRecords]);

  // Memoizar los selectores de grupos para evitar recrearlos en cada render
  const groupOptions = useMemo(() => {
    return groups.map((group) => (
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
            Registra la asistencia de los estudiantes
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <div className="flex items-center space-x-2 mt-1">
            <Clock className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-500">{formattedTime}</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Filtro de fechas */}
          <DateFilter
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />

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
              onChange={(e) =>
                setSelectedGroupId(
                  e.target.value ? parseInt(e.target.value) : ""
                )
              }
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
          ) : filteredStudents.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {studentsWithAttendance.map(({ student, attendanceRecord }) => (
                <AttendanceRow
                  key={`student-${student.id}`}
                  student={student}
                  attendanceRecord={attendanceRecord}
                  onStatusChange={handleAttendanceChange}
                />
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No hay estudiantes para mostrar. Selecciona un grupo o ajusta tu búsqueda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
