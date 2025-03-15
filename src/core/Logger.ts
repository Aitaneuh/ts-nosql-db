import winston from "winston";
import fs from "fs";
import path from "path";

const logDir = path.join(__dirname, "../../logs");

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}


const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const logFileName = path.join(logDir, `logs-${timestamp}.txt`);

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
        new winston.transports.File({ filename: logFileName })
    ],
});

export default logger;
