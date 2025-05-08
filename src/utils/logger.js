// src/utils/logger.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logsDir = path.join(__dirname, '..', 'logs');

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

const getLogFilePath = (level) => path.join(logsDir, `${level}.log`);

const writeLog = (level, content) => {
    const timestamp = new Date().toISOString();
    const formatted = `[${timestamp}] [${level.toUpperCase()}] ${content}\n`;

    fs.appendFile(getLogFilePath(level), formatted, (err) => {
        if (err) {
            console.error('Logging error:', err);
        }
    });

    if (level === 'info') {
        console.log(formatted.trim());
    } else if (level === 'warn') {
        console.warn(formatted.trim());
    } else if (level === 'errors') {
        console.error(formatted.trim());
    }
};

export const logger = {
    info: (msg) => writeLog('info', typeof msg === 'string' ? msg : JSON.stringify(msg)),
    warn: (msg) => writeLog('warn', typeof msg === 'string' ? msg : JSON.stringify(msg)),
    error: (err) => {
        const message = err?.stack || err?.message || JSON.stringify(err);
        writeLog('errors', message);
    }
};
