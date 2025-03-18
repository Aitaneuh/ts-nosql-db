import express from "express";
import fs from 'fs';
import path from "path";
import NoSQLDatabase from "../core/Database";
import logger from "../core/Logger";
import { getUptime, getLatestLogFile, cleanOldLogs } from "../core/Utils";

// Initialize app, database, and logs directory
const app = express();
const db = new NoSQLDatabase("data");
const logDir = path.resolve(__dirname, "../../logs");
const PORT = 3000;
const VERSION = "1.0";
const STARTTIME = Date.now();

logger.info(`STARTING Server on port ${PORT}, version ${VERSION}`);
logger.info(`STARTING Start time: ${STARTTIME}`);

app.use(express.json());
app.use(express.static("public"));

// Clean old logs
cleanOldLogs(logDir);
logger.info("STARTING Cleaned old log files");

// Middleware to handle errors globally
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error(err.message);
    res.status(500).json({ error: err.message });
});

// Middleware to validate request body for POST and PUT
function validateRequest(req: express.Request, res: express.Response): boolean {
    const { id, data } = req.body;
    if (!id || !data) {
        res.status(400).json({ error: "Missing 'id' or 'data' in request body" });
        return false;
    }
    return true;
}

// Route: Get latest logs
app.get("/logs", (req, res) => {
    const latestLogFile = getLatestLogFile(logDir);

    if (!latestLogFile) {
        logger.error("No log files found.");
        res.status(404).send("No log files found.");
        return;
    }

    fs.readFile(latestLogFile, "utf8", (err, data) => {
        if (err) {
            logger.error(`Error reading log file: ${err}`);
            res.status(500).send("Unable to retrieve logs.");
            return;
        }
        res.type("text/plain").send(data);
    });

    logger.info("GET /logs");
});


// CRUD operations
app.post("/:collection", (req, res) => {
    if (!validateRequest(req, res)) return;

    const { collection } = req.params;
    const { id, data } = req.body;
    db.addDocument(collection, id, data);
    res.status(201).json({ message: "Successfully added", id });
});

app.get("/:collection/:id", (req, res) => {
    const { collection, id } = req.params;
    const doc = db.getDocument(collection, id);
    doc ? res.json(doc) : res.status(404).json({ error: `Document ${id} not found in ${collection}` });
});

app.get("/:collection", (req, res) => {
    const { collection } = req.params;
    const docs = db.getCollection(collection);
    docs.length > 0 ? res.json(docs) : res.status(404).json({ error: `No documents found in ${collection}` });
});

app.put("/:collection/:id", (req, res) => {
    if (!validateRequest(req, res)) return;

    const { collection, id } = req.params;
    const { data } = req.body;
    const updated = db.updateDocument(collection, id, data);
    updated ? res.json({ message: "Successfully updated" }) : res.status(404).json({ error: `Document ${id} not found` });
});

app.delete("/:collection/:id", (req, res) => {
    const { collection, id } = req.params;
    const deleted = db.deleteDocument(collection, id);
    deleted ? res.json({ message: "Successfully deleted" }) : res.status(404).json({ error: `Document ${id} not found` });
});

// Start server
app.listen(PORT, () => logger.info(`STARTED Server running on port ${PORT}, version ${VERSION}`));

// Periodic tasks
setInterval(() => logger.info(`STATUS Server uptime: ${getUptime(STARTTIME)}`), 60 * 60 * 1000);
setInterval(() => cleanOldLogs(logDir), 24 * 60 * 60 * 1000);
