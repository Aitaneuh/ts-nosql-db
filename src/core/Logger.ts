import winston from "winston";
import fs from "fs";
import path from "path";

const isTestEnv = process.env.NODE_ENV === "test";

const logDir = path.join(__dirname, "../../logs");

if (!isTestEnv && !fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const logFileName = path.join(logDir, `logs-${timestamp}.log`);

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        ...(isTestEnv ? [] : [new winston.transports.File({ filename: logFileName })])
    ],
});

export default logger;
