// src/index.ts
import app from "./app";
import { env } from "./config/env";
import logger from "./config/logger";

const PORT = env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Servidor corriendo en el puerto ${PORT}`);
});
