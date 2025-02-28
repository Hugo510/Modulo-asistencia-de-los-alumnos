import { useState, useEffect } from "react";
import { Plus, Search, MoreVertical, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";

export function GroupsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGroup, setNewGroup] = useState({
    nombre: ""
  });

  const { groups, addGroup, fetchGroups } = useStore();

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const filteredGroups = groups.filter(
    (group) =>
      group.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    await addGroup(newGroup);
    setNewGroup({ nombre: "" });
    setShowAddForm(false);
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Grupos</h1>
          <p className="mt-2 text-sm text-gray-700">
            Administra tus grupos de estudiantes y cursos
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Grupo
          </Button>
        </div>
      </div>

      {showAddForm && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Agregar Nuevo Grupo</h2>
          <form onSubmit={handleAddGroup} className="space-y-4">
            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre del Grupo
              </label>
              <Input
                id="nombre"
                value={newGroup.nombre}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, nombre: e.target.value })
                }
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancelar
              </Button>
              <Button type="submit">Agregar Grupo</Button>
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
              placeholder="Buscar grupos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-hidden bg-white shadow sm:rounded-md">
          {filteredGroups.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredGroups.map((group) => {
                // Usa los alumnos directamente del grupo o obtén los estudiantes del store
                const students = group.alumnos || [];
                return (
                  <li key={group.id}>
                    <div className="flex items-center px-4 py-4 sm:px-6">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="truncate text-sm font-medium text-blue-600">
                            {group.nombre}
                          </p>
                        </div>
                        <div className="mt-2 flex">
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="mr-1.5 h-4 w-4 flex-shrink-0" />
                            <span>{students.length} estudiantes</span>
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
                );
              })}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Se cargaron los grupos correctamente, pero por el momento no hay ninguno.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
