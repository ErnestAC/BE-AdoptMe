// src/middlewares/loggerMiddleware.js

import { getLogger } from '../utils/logger.js';

const logger = getLogger();

export const loggerMiddleware = (req, res, next) => {
    req.logger = logger;
    next();
};
