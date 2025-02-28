import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando proceso de seed...");

  // Limpiar datos existentes (opcional)
  await prisma.asistencia.deleteMany();
  await prisma.grupoAlumno.deleteMany();
  await prisma.alumno.deleteMany();
  await prisma.grupo.deleteMany();
  await prisma.usuario.deleteMany();

  console.log("Base de datos limpiada correctamente");

  // Crear usuarios de muestra
  const hashedPassword = await bcrypt.hash("password123", 10);

  const admin = await prisma.usuario.create({
    data: {
      nombre: "Administrador",
      correo: "admin@example.com",
      password: hashedPassword,
      rol: "ADMIN",
    },
  });

  const profesor1 = await prisma.usuario.create({
    data: {
      nombre: "Profesor Demo",
      correo: "profesor@example.com",
      password: hashedPassword,
      rol: "TEACHER",
    },
  });

  console.log("Usuarios creados:", { admin, profesor1 });

  // Crear grupos
  const grupo1 = await prisma.grupo.create({
    data: {
      nombre: "Matemáticas 101",
      idUsuario: profesor1.id,
    },
  });

  const grupo2 = await prisma.grupo.create({
    data: {
      nombre: "Programación Web",
      idUsuario: profesor1.id,
    },
  });

  console.log("Grupos creados:", { grupo1, grupo2 });

  // Crear alumnos
  const alumnos = await Promise.all([
    prisma.alumno.create({
      data: { nombre: "Ana", apellido: "García", correo: "ana@example.com" },
    }),
    prisma.alumno.create({
      data: {
        nombre: "Carlos",
        apellido: "Rodríguez",
        correo: "carlos@example.com",
      },
    }),
    prisma.alumno.create({
      data: {
        nombre: "Sofía",
        apellido: "Martínez",
        correo: "sofia@example.com",
      },
    }),
    prisma.alumno.create({
      data: {
        nombre: "Miguel",
        apellido: "López",
        correo: "miguel@example.com",
      },
    }),
    prisma.alumno.create({
      data: {
        nombre: "Laura",
        apellido: "Sánchez",
        correo: "laura@example.com",
      },
    }),
  ]);

  console.log(`${alumnos.length} alumnos creados`);

  // Asignar alumnos a grupos
  await prisma.grupoAlumno.createMany({
    data: [
      { idGrupo: grupo1.id, idAlumno: alumnos[0].id },
      { idGrupo: grupo1.id, idAlumno: alumnos[1].id },
      { idGrupo: grupo1.id, idAlumno: alumnos[2].id },
      { idGrupo: grupo2.id, idAlumno: alumnos[2].id },
      { idGrupo: grupo2.id, idAlumno: alumnos[3].id },
      { idGrupo: grupo2.id, idAlumno: alumnos[4].id },
    ],
  });

  console.log("Alumnos asignados a grupos correctamente");

  // Crear algunos registros de asistencia
  const hoy = new Date();
  const ayer = new Date(hoy);
  ayer.setDate(hoy.getDate() - 1);

  await prisma.asistencia.createMany({
    data: [
      { idAlumno: alumnos[0].id, fecha: hoy, estado: "PRESENTE" },
      { idAlumno: alumnos[1].id, fecha: hoy, estado: "PRESENTE" },
      { idAlumno: alumnos[2].id, fecha: hoy, estado: "AUSENTE" },
      { idAlumno: alumnos[0].id, fecha: ayer, estado: "PRESENTE" },
      { idAlumno: alumnos[1].id, fecha: ayer, estado: "PRESENTE" },
      { idAlumno: alumnos[2].id, fecha: ayer, estado: "PRESENTE" },
    ],
  });

  console.log("Registros de asistencia creados correctamente");
  console.log("Proceso de seed completado exitosamente");
}

main()
  .catch((e) => {
    console.error("Error durante el proceso de seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
