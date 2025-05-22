// src/middlewares/errorHandler.js

import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    const code = err.code || 'UNKNOWN_ERROR';
    const message = err.message || 'Internal Server Error';

    logger.error(`[${code}] ${message}`);

    res.status(status).json({
        status: "error",
        code,
        message
    });
};
