# Sistema de Asistencia de Alumnos

Este repositorio contiene la aplicación completa del Sistema de Asistencia de Alumnos, que consta de un frontend desarrollado en React/Vite y un backend en Node.js.

## Estructura del Repositorio

- `/frontend`: Contiene la aplicación de cliente desarrollada con React y Vite
- `/backend`: Contiene la API REST desarrollada con Node.js

## Requisitos Previos del Sistema

- Node.js (versión 14.x o superior)
- npm (generalmente viene instalado con Node.js)
- MySQL (v8.x o superior) o MariaDB con una base de datos creada
- Acceso a las credenciales de la base de datos

## Instrucciones para el Frontend

### Ejecutando la aplicación frontend

1. **Descarga o clona el repositorio**

   Asegúrate de tener todo el código fuente descargado en tu computadora.

2. **Abre una terminal o línea de comandos**

   Navega hasta la carpeta donde se encuentra el proyecto frontend:

   ```
   cd ruta/al/repositorio/frontend
   ```

3. **Instala las dependencias del proyecto**

   Ejecuta el siguiente comando para instalar todas las dependencias necesarias:

   ```
   npm install
   ```

4. **Ejecuta el servidor de vista previa**

   Para ejecutar la versión de producción:

   ```
   npm run preview
   ```

   O para desarrollo:

   ```
   npm run dev
   ```

5. **Accede a la aplicación**

   Una vez iniciado el servidor, verás un mensaje en la terminal con la URL donde se está ejecutando la aplicación, generalmente:

   ```
   ➜  Local:   http://localhost:4173/     (producción)
   ➜  Local:   http://localhost:5173/     (desarrollo)
   ```

   Abre tu navegador web y visita esa dirección para acceder a la aplicación.

### Solución de problemas comunes (Frontend)

- **Error de conexión**: Verifica que el puerto especificado no esté siendo utilizado por otra aplicación.
- **Dependencias faltantes**: Si hay errores relacionados con módulos faltantes, asegúrate de haber ejecutado `npm install` correctamente.

## Instrucciones para el Backend

### Instalación y configuración

1. Abre una terminal o línea de comandos y navega al directorio del backend:

   ```
   cd ruta/al/repositorio/backend
   ```

2. Instala las dependencias necesarias:

   ```
   npm install
   ```

### Configuración del entorno

1. Crea un archivo `.env` en el directorio backend con el siguiente contenido:

   ```
   DATABASE_URL="mysql://usuario:contraseña@localhost:3306/nombre_base_de_datos"
   JWT_SECRET="una_clave_aleatoria_segura"
   NODE_ENV=production
   PORT=3000
   EMAIL_HOST=smtp.ejemplo.com
   EMAIL_PORT=587
   EMAIL_USER=tu_usuario
   EMAIL_PASS=tu_contraseña
   EMAIL_FROM="No Reply <noreply@ejemplo.com>"
   FRONTEND_URL=http://url-de-tu-frontend
   ```

   Reemplaza los valores con la configuración apropiada para tu entorno.

### Configuración de la Base de Datos

#### Opción 1: Uso de migraciones automáticas (Recomendado)

1. Asegúrate de que la base de datos especificada en DATABASE_URL existe:

   ```sql
   CREATE DATABASE IF NOT EXISTS nombre_base_de_datos;
   ```

2. Aplica las migraciones de la base de datos:

   ```
   npx prisma migrate deploy
   ```

3. Genera el cliente de Prisma:

   ```
   npx prisma generate
   ```
4. Cargar datos de muestra:

   ```bash
   npm run seed
   ```

   Esto creará automáticamente:

   - Usuario administrador (correo: admin@example.com, contraseña: password123)
   - Usuario profesor (correo: profesor@example.com, contraseña: password123)
   - Grupos de muestra
   - Alumnos de muestra
   - Registros de asistencia de ejemplo

   > **Recomendación para pruebas**: Para probar correctamente el proyecto, se recomienda iniciar sesión con el usuario profesor (correo: profesor@example.com, contraseña: password123), ya que este cuenta con grupos y alumnos preconfigurados listos para gestionar asistencias.


#### Opción 2: Uso de SQL directo

1. Genera el SQL para crear las tablas:

   ```
   npx prisma migrate deploy --create-only
   ```

2. Encontrarás los archivos SQL en la carpeta `prisma/migrations`. Ejecuta estos scripts en tu base de datos.

### Ejecución del Backend

1. Para iniciar el servidor, ejecuta:

   ```
   npm start
   ```

2. Deberías ver mensajes indicando que el servidor se ha iniciado correctamente y está escuchando en el puerto especificado (por defecto: 3000).

### Verificación del Backend

1. Abre un navegador o una herramienta como Postman.

2. Accede a `http://localhost:3000/api` (o el puerto que hayas configurado).

3. Si todo está configurado correctamente, deberías recibir una respuesta que indica que la API está en funcionamiento.

### Ejecución con PM2 (Recomendado para Producción)

Para mantener el servidor ejecutándose en segundo plano y reiniciarse automáticamente:

1. Instala PM2 globalmente:

   ```
   npm install -g pm2
   ```

2. Inicia la aplicación con PM2:

   ```
   pm2 start dist/index.js --name "asistencia-backend"
   ```

3. Para ver los logs:

   ```
   pm2 logs asistencia-backend
   ```

### Solución de Problemas (Backend)

- **Error de conexión a la base de datos**: Verifica que las credenciales en el archivo .env sean correctas y que la base de datos esté accesible.
- **Error "Puerto en uso"**: Cambia el puerto en el archivo .env si el puerto predeterminado ya está siendo utilizado.
- **Error "Módulo no encontrado"**: Asegúrate de haber ejecutado npm install correctamente.

## Ejecutando el Sistema Completo

Para ejecutar el sistema completo, debes:

1. Iniciar primero el backend siguiendo las instrucciones anteriores.
2. A continuación, iniciar el frontend.
3. Asegúrate de que la variable FRONTEND_URL en el backend apunta a la URL donde se está ejecutando el frontend.
4. Asegúrate de que las llamadas API desde el frontend apuntan a la URL correcta del backend.

## Notas Importantes

- Esta configuración es para un entorno de ejecución básico. Para un entorno de producción completo, considera usar un servidor web como Nginx o Apache como proxy inverso.
- Asegúrate de utilizar valores seguros y únicos para JWT_SECRET y otras claves sensibles.
- El archivo .env contiene información sensible. No lo compartas ni lo subas a repositorios públicos.
