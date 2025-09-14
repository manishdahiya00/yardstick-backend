import winston from "winston";

const transports = [
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(({ level, message, timestamp }) => {
                return `[${String(timestamp)}] ${level}: ${String(message)}`;
            }),
        ),
    }),
];

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    defaultMeta: { service: "auth-service" },
    transports,
});

export default logger;
