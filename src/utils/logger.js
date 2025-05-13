    // src/utils/logger.js

    import { createLogger, format, transports } from "winston";
    import path from "path";

    const { combine, timestamp, printf, colorize } = format;

    const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
    });

    const logger = createLogger({
    level: "info",
    format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
    transports: [
        new transports.Console({
        format: combine(
            colorize(),
            timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            logFormat
        ),
        }),
        new transports.File({
        filename: path.join("logs", "error.log"),
        level: "error",
        }),
        new transports.File({ filename: path.join("logs", "combined.log") }),
    ],
    });

    export default logger;


