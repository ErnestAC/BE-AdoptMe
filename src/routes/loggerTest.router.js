// src/routes/loggerTest.router.js

import { Router } from 'express';
import { getLogger } from '../utils/logger.js';
import { CustomError } from '../utils/errors/CustomError.js';
import { ERROR_DICTIONARY } from '../utils/errorDictionary.js';

const fallbackLogger = getLogger();
const router = Router();

router.get('/', (req, res, next) => {
    const logger = req.logger || fallbackLogger;

    try {
        
        logger.fatal("Fatal level log");
        logger.error("Error level log");
        logger.warning("Warning level log");
        logger.info("Info level log");
        logger.debug("Debug level log");


        res.send({
            status: 'success',
            message: 'Logger test completed. Check console and log files.'
        });
    } catch {
        next(new CustomError({ ...ERROR_DICTIONARY.INTERNAL_SERVER_ERROR }));
    }
});

export default router;
