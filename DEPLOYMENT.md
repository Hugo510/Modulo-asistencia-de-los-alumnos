# Instrucciones para Ejecutar el Backend (Solo carpeta 'dist')

## Requisitos Previos

- Node.js (v14.x o superior) instalado en tu sistema
- MySQL (v8.x o superior) o MariaDB con una base de datos creada
- Acceso a las credenciales de la base de datos

## Instalación

1. Descomprime o coloca la carpeta `dist` en el directorio de tu elección.

2. Abre una terminal o línea de comandos y navega al directorio padre que contiene la carpeta `dist`:

```bash
cd ruta/al/directorio/que/contiene/dist
```

3. Instala las dependencias necesarias:

```bash
npm install --only=production
```

## Configuración

1. Crea un archivo `.env` en el mismo directorio que la carpeta `dist` con el siguiente contenido:

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

## Ejecución

1. Para iniciar el servidor, ejecuta:

```bash
node dist/index.js
```

2. Alternativamente, si el archivo `package.json` está disponible, puedes ejecutar:

```bash
npm start
```

3. Deberías ver mensajes indicando que el servidor se ha iniciado correctamente y está escuchando en el puerto especificado (por defecto: 3000).

## Verificación

1. Abre un navegador o una herramienta como Postman.

2. Accede a `http://localhost:3000/api` (o el puerto que hayas configurado).

3. Si todo está configurado correctamente, deberías recibir una respuesta que indica que la API está en funcionamiento.

## Ejecución con PM2 (Recomendado para Producción)

Para mantener el servidor ejecutándose en segundo plano y reiniciarse automáticamente:

1. Instala PM2 globalmente:

```bash
npm install -g pm2
```

2. Inicia la aplicación con PM2:

```bash
pm2 start dist/index.js --name "asistencia-backend"
```

3. Para ver los logs:

```bash
pm2 logs asistencia-backend
```

4. Para reiniciar la aplicación:

```bash
pm2 restart asistencia-backend
```

## Solución de Problemas

- **Error de conexión a la base de datos**: Verifica que las credenciales en el archivo `.env` sean correctas y que la base de datos esté accesible desde el servidor.

- **Error "Puerto en uso"**: Cambia el puerto en el archivo `.env` si el puerto predeterminado ya está siendo utilizado.

- **Error "Módulo no encontrado"**: Asegúrate de haber ejecutado `npm install` y que todas las dependencias se instalaron correctamente.

- **Error de permisos**: En sistemas Unix/Linux, asegúrate de tener los permisos adecuados para ejecutar el servidor y acceder a los archivos requeridos.

## Notas Importantes

- Esta configuración es para un entorno de ejecución básico. Para un entorno de producción completo, considera usar un servidor web como Nginx o Apache como proxy inverso.
- Asegúrate de utilizar valores seguros y únicos para `JWT_SECRET` y otras claves sensibles.
- El archivo `.env` contiene información sensible. No lo compartas ni lo subas a repositorios públicos.
