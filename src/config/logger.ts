import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    defaultMeta: { service: "auth-service" },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                winston.format.printf(({ level, message, timestamp }) => {
                    return `[${String(timestamp)}] ${level}: ${String(message)}`;
                }),
            ),
        }),

        new DailyRotateFile({
            dirname: "logs",
            filename: "error-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            level: "error",
            maxFiles: "10d",
            format: winston.format.json(),
        }),

        new DailyRotateFile({
            dirname: "logs",
            filename: "app-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            level: "info",
            maxFiles: "10d",
            format: winston.format.json(),
        }),
    ],
});

export default logger;
