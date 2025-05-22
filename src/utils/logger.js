// src/utils/logger.js

import { createLogger, format, transports } from "winston";
import path from "path";

const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp }) => {
    const time = typeof timestamp === 'string' ? timestamp : JSON.stringify(timestamp);
    const msg = typeof message === 'string' ? message : JSON.stringify(message);
    return `${time} [${level}]: ${msg}`;
});

const devLogger = createLogger({
    level: "verbose",
    format: combine(
        colorize(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
    ),
    transports: [
        new transports.Console()
    ]
});

const prodLogger = createLogger({
    level: "warn",
    format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
    ),
    transports: [
        new transports.File({
            filename: path.join("logs", "warnings.log"),
            level: "warn"
        }),
        new transports.File({
            filename: path.join("logs", "errors.log"),
            level: "error"
        }),
        new transports.File({
            filename: path.join("logs", "combined.log")
        })
    ]
});

// Chooses the logger based on NODE_ENV
export const getLogger = () => {
    return process.env.NODE_ENV === 'prod' ? prodLogger : devLogger;
};

// Optional: also export explicitly
export { devLogger, prodLogger };
