"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const logger_1 = __importDefault(require("./config/logger"));
const PORT = env_1.env.PORT || 3000;
app_1.default.listen(PORT, () => {
    logger_1.default.info(`Servidor corriendo en el puerto ${PORT}`);
});
