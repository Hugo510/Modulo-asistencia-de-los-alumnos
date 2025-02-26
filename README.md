# Sistema de Asistencia de Alumnos - Backend

## Descripción

Este sistema permite gestionar la asistencia de los alumnos en un entorno educativo. El backend proporciona una API RESTful para registrar, consultar y administrar la asistencia de estudiantes.

## Requisitos previos

- Node.js (v14.x o superior)
- npm (v6.x o superior)
- MySQL (v8.x o superior) o MariaDB

## Instalación

1. Clonar el repositorio:

```bash
git clone <url-del-repositorio>
cd "Módulo asistencia de los alumnos/backend"
```

2. Instalar dependencias:

```bash
npm install
```

3. Crear archivo de variables de entorno:

```bash
cp .env.example .env
```

4. Configurar las variables de entorno en el archivo `.env` (ver sección de Configuración).

5. Ejecutar las migraciones de la base de datos:

```bash
npx prisma migrate dev
```

## Configuración

Edita el archivo `.env` con los siguientes valores:

```
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/nombre_base_de_datos"
JWT_SECRET="tu_clave_secreta_jwt"
NODE_ENV=development
PORT=3000
EMAIL_HOST=smtp.ejemplo.com
EMAIL_PORT=587
EMAIL_USER=tu_usuario
EMAIL_PASS=tu_contraseña
EMAIL_FROM="No Reply <noreply@ejemplo.com>"
FRONTEND_URL=http://localhost:3000
RECAPTCHA_SECRET_KEY=tu_clave_secreta_recaptcha
```

## Estructura del proyecto

```
/backend
├── /src                # Código fuente principal
│   ├── /config         # Configuración (base de datos, env, logger)
│   ├── /controllers    # Controladores para las rutas
│   ├── /middlewares    # Middlewares (auth, error handling)
│   ├── /routes         # Definición de rutas API
│   ├── /services       # Lógica de negocio
│   ├── /utils          # Utilidades y funciones auxiliares
│   ├── app.ts          # Configuración de Express
│   └── index.ts        # Punto de entrada de la aplicación
├── /prisma             # Configuración y migraciones de Prisma
│   ├── /migrations     # Migraciones de la base de datos
│   └── schema.prisma   # Esquema de la base de datos
├── /logs               # Archivos de registro (generados en tiempo de ejecución)
├── /tests              # Pruebas unitarias e integración
├── package.json        # Dependencias y scripts
└── tsconfig.json       # Configuración de TypeScript
```

## Ejecución

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm start
```

## API Endpoints

### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/recovery` - Solicitar recuperación de contraseña
- `POST /api/auth/reset` - Restablecer contraseña

### Usuarios

- `GET /api/users` - Obtener lista de usuarios
- `GET /api/users/:id` - Obtener detalles de un usuario
- `POST /api/users` - Crear nuevo usuario
- `PUT /api/users/:id` - Actualizar datos de un usuario
- `DELETE /api/users/:id` - Eliminar un usuario

### Grupos

- `GET /api/groups` - Obtener lista de grupos
- `GET /api/groups/:id` - Obtener detalles de un grupo
- `POST /api/groups` - Crear nuevo grupo
- `PUT /api/groups/:id` - Actualizar un grupo
- `DELETE /api/groups/:id` - Eliminar un grupo

### Estudiantes

- `GET /api/students` - Obtener lista de estudiantes
- `GET /api/students/:id` - Obtener detalles de un estudiante
- `POST /api/students` - Crear nuevo estudiante
- `PUT /api/students/:id` - Actualizar datos de un estudiante
- `DELETE /api/students/:id` - Eliminar un estudiante

### Asistencias

- `GET /api/attendance` - Obtener registros de asistencia
- `GET /api/attendance/:id` - Obtener un registro específico
- `POST /api/attendance` - Registrar nueva asistencia
- `PUT /api/attendance/:id` - Actualizar un registro de asistencia
- `DELETE /api/attendance/:id` - Eliminar un registro de asistencia

## Documentación de la API

Se puede acceder a la documentación detallada de la API a través de Swagger:

```
http://localhost:3000/docs
```

## Base de datos

El proyecto utiliza Prisma ORM con MySQL. El esquema incluye las siguientes entidades:

- **Usuario**: Profesores y administradores del sistema
- **Grupo**: Agrupaciones de estudiantes (clases, cursos)
- **Alumno**: Información de los estudiantes
- **GrupoAlumno**: Relación muchos a muchos entre grupos y alumnos
- **Asistencia**: Registros de asistencia de los alumnos

## Contribución

1. Crea un fork del repositorio
2. Crea una nueva rama (`git checkout -b feature/nueva-caracteristica`)
3. Realiza tus cambios y haz commit (`git commit -m 'Añadir nueva característica'`)
4. Sube tus cambios (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo [MIT License](LICENSE).
