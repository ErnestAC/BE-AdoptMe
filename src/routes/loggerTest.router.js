// src/routes/loggerTest.router.js

import { Router } from 'express';
import logger from '../utils/logger.js';

const router = Router();

router.get('/loggerTest', (req, res) => {
    logger.error('This is an error log');
    logger.warn('This is a warning log');
    logger.info('This is an info log');
    logger.http?.('This is an http log');
    logger.verbose?.('This is a verbose log');
    logger.debug?.('This is a debug log');
    logger.silly?.('This is a silly log');

    res.send({ status: 'success', message: 'Logger test completed. Check your console and log files.' });
});

export default router;
