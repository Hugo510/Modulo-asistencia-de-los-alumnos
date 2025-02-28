# Sistema de Asistencia de Alumnos - Frontend

## Ejecutando la aplicación desde la carpeta 'dist'

Este documento describe cómo ejecutar la versión compilada de la aplicación frontend utilizando la carpeta `dist` generada previamente.

### Requisitos previos

- Node.js (versión 14.x o superior)
- npm (generalmente viene instalado con Node.js)

### Instrucciones para ejecutar la aplicación

Sigue estos pasos para ejecutar la aplicación frontend:

1. **Descarga o clona el repositorio**

   Asegúrate de tener todo el código fuente descargado en tu computadora.

2. **Abre una terminal o línea de comandos**

   Navega hasta la carpeta donde se encuentra el proyecto:

   ```
   cd ruta/a/Módulo asistencia de los alumnos/frontend
   ```

3. **Instala las dependencias del proyecto**

   Ejecuta el siguiente comando para instalar todas las dependencias necesarias:

   ```
   npm install
   ```

4. **Ejecuta el servidor de vista previa**

   Si ya tienes la carpeta `dist` generada, ejecuta:

   ```
   npm run preview
   ```

5. **Accede a la aplicación**

   Una vez iniciado el servidor, verás un mensaje en la terminal con la URL donde se está ejecutando la aplicación, generalmente:

   ```
   ➜  Local:   http://localhost:4173/
   ```

   Abre tu navegador web y visita esa dirección para acceder a la aplicación.

### Solución de problemas comunes

- **La carpeta `dist` no existe**: Esto significa que la aplicación no ha sido compilada. Ejecuta primero `npm run build` para generarla.
- **Error de conexión**: Verifica que el puerto especificado (por lo general 4173) no esté siendo utilizado por otra aplicación.
- **Dependencias faltantes**: Si hay errores relacionados con módulos faltantes, asegúrate de haber ejecutado `npm install` correctamente.

### Nota importante

Esta es una versión de producción optimizada de la aplicación. Para desarrollo, se recomienda usar `npm run dev` en su lugar.
