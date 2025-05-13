// src/middlewares/errorHandler.js

import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
    logger.error(err);

    const status = err.status || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ status: "error", message });
};
