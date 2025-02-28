"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    }
    catch (error) {
        res.status(400).json({
            error: "Datos inválidos",
            details: error.errors,
        });
        return;
    }
};
exports.validate = validate;
