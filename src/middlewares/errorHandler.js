// src/middlewares/errorHandler.js

import { getLogger } from "../utils/logger.js";

const fallbackLogger = getLogger();

export const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    const code = err.code || 'UNKNOWN_ERROR';
    const message = err.message || 'Internal Server Error';

    const activeLogger = req.logger || fallbackLogger;
    activeLogger.error(`[${code}] ${message}`);

    res.status(status).json({
        status: "error",
        code,
        message
    });
};
