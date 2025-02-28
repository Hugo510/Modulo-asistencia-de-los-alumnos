import { useState, useEffect } from "react";
import { Search, Mail, MoreVertical, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStudentsStore } from "@/lib/storeStudents";
import { useStore } from "@/lib/store"; // Para acceder a los grupos

export function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | "">("");
  const [newStudent, setNewStudent] = useState({
    nombre: "",
    apellido: "",
    correo: ""
  });

  const { students, fetchStudents, addStudent } = useStudentsStore();
  const { groups, fetchGroups } = useStore(); // Obtener grupos del store

  useEffect(() => {
    fetchStudents();
    fetchGroups(); // Cargar la lista de grupos al montar el componente
  }, [fetchStudents, fetchGroups]);

  const filteredStudents = students.filter(
    (student) =>
      `${student.nombre} ${student.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedGroupId === "") {
      // Podríamos mostrar un mensaje de error aquí
      return;
    }

    await addStudent(selectedGroupId as number, newStudent);
    setNewStudent({ nombre: "", apellido: "", correo: "" });
    setSelectedGroupId("");
    setShowAddForm(false);
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Estudiantes</h1>
          <p className="mt-2 text-sm text-gray-700">
            Administra la lista de estudiantes y su información
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button onClick={() => setShowAddForm(true)}>
            <UserPlus className="h-5 w-5 mr-2" />
            Nuevo Estudiante
          </Button>
        </div>
      </div>

      {showAddForm && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Agregar Nuevo Estudiante</h2>
          <form onSubmit={handleAddStudent} className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <Input
                id="nombre"
                value={newStudent.nombre}
                onChange={(e) => setNewStudent({ ...newStudent, nombre: e.target.value })}
                required
              />
            </div>
            <div>
              <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
                Apellido
              </label>
              <Input
                id="apellido"
                value={newStudent.apellido}
                onChange={(e) => setNewStudent({ ...newStudent, apellido: e.target.value })}
                required
              />
            </div>
            <div>
              <label htmlFor="correo" className="block text-sm font-medium text-gray-700">
                Correo Electrónico
              </label>
              <Input
                id="correo"
                type="email"
                value={newStudent.correo}
                onChange={(e) => setNewStudent({ ...newStudent, correo: e.target.value })}
                required
              />
            </div>

            {/* Nuevo campo: selector de grupo */}
            <div>
              <label htmlFor="groupId" className="block text-sm font-medium text-gray-700">
                Grupo
              </label>
              <select
                id="groupId"
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value ? parseInt(e.target.value) : "")}
                required
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Selecciona un grupo</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancelar
              </Button>
              <Button type="submit">Agregar Estudiante</Button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-6">
        <div className="flex items-center mb-4">
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
          {filteredStudents.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <li key={student.id}>
                  <div className="flex items-center px-4 py-4 sm:px-6">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-blue-600">
                          {student.nombre} {student.apellido}
                        </p>
                      </div>
                      <div className="mt-2 flex">
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="mr-1.5 h-4 w-4 flex-shrink-0" />
                          <span>{student.correo}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-5 flex-shrink-0">
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Se cargaron los estudiantes correctamente, pero por el momento no hay ninguno.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
