// src/utils/logger.js

import { createLogger, format, transports, addColors } from "winston";
import path from "path";

const { combine, timestamp, printf, colorize } = format;

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        debug: 4,
    },
    colors: {
        fatal: 'red',
        error: 'magenta',
        warning: 'yellow',
        info: 'blue',
        debug: 'white',
    }
};

// Register the custom colors with Winston
addColors(customLevelsOptions.colors);

const logFormat = printf(({ level, message, timestamp }) => {
    const time = typeof timestamp === 'string' ? timestamp : JSON.stringify(timestamp);
    const msg = typeof message === 'string' ? message : JSON.stringify(message);
    return `${time} [${level}]: ${msg}`;
});

const devLogger = createLogger({
    levels: customLevelsOptions.levels,
    level: "debug",
    format: combine(
        colorize({ all: true }), // correct use of colorize with custom colors
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
    ),
    transports: [new transports.Console()]
});

const prodLogger = createLogger({
    levels: customLevelsOptions.levels,
    level: "warning",
    format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
    ),
    transports: [
        new transports.File({ filename: path.join("logs", "fatal.log"), level: "fatal" }),
        new transports.File({ filename: path.join("logs", "errors.log"), level: "error" }),
        new transports.File({ filename: path.join("logs", "warnings.log"), level: "warning" }),
        new transports.File({ filename: path.join("logs", "combined.log") })
    ]
});

// Function to choose the logger based on environment
const getLogger = () => {
    return process.env.NODE_ENV === 'prod' ? prodLogger : devLogger;
};

export default getLogger();
export { getLogger, devLogger, prodLogger };
