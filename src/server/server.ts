import express from "express";
import fs from 'fs';
import path from "path";
import NoSQLDatabase from "../core/Database";
import logger from "../core/Logger";
import { getUptime, getLatestLogFile } from "../core/Utils";

// Initialize app and database
const app = express();
const db = new NoSQLDatabase("data");

const PORT = 3000;
logger.info(`STARTING Port configured on ${PORT}`)

// to remember when started
const STARTTIME = Date.now();
logger.info(`STARTING Start time set to ${STARTTIME}`)

const VERSION = "1.0";
logger.info(`STARTING using version ${VERSION}`)

app.use(express.json());

app.use(express.static("public"));


// Function to handle errors more gracefully
function handleError(res: express.Response, error: Error, statusCode: number = 500) {
    logger.error(error.message);
    res.status(statusCode).json({ error: error.message });
}


// Get logs
app.get("/logs", (req, res) => {
    const logDir = path.resolve(__dirname, "../../logs");

    const latestLogFile = getLatestLogFile(logDir);

    if (!latestLogFile) {
        res.status(404).json({ error: "No log files found" });
        return;
    }

    try {
        const logs = fs.readFileSync(latestLogFile, "utf8").split("\n").filter(line => line.trim() !== "");
        res.json({ file: path.basename(latestLogFile), logs });
    } catch (error) {
        handleError(res, error as Error);
    }
});

// Add Document to collection
app.post("/:collection", (req, res) => {
    const { collection } = req.params;
    const { id, data } = req.body;

    // Basic validation for input
    if (!id || !data) {
        res.status(400).json({ error: "Missing 'id' or 'data' in request body" });
        return;
    }

    try {
        db.addDocument(collection, id, data);
        res.status(201).json({ message: "Successfully added", id });
    } catch (error) {
        handleError(res, error as Error);
    }
});

// Get Document by collection and ID
app.get("/:collection/:id", (req, res) => {
    const { collection, id } = req.params;

    try {
        const doc = db.getDocument(collection, id);
        if (doc) {
            res.json(doc);
        } else {
            res.status(404).json({ error: `Document with ID ${id} not found in collection ${collection}` });
        }
    } catch (error) {
        handleError(res, error as Error);
    }
});

// Example: Get all documents from a collection (just for demonstration)
app.get("/:collection", (req, res) => {
    const { collection } = req.params;

    try {
        const docs = db.getCollection(collection);
        if (docs.length > 0) {
            res.json(docs);
        } else {
            res.status(404).json({ error: `No documents found in collection ${collection}` });
        }
    } catch (error) {
        handleError(res, error as Error);
    }
});

// Update Document by ID
app.put("/:collection/:id", (req, res) => {
    const { collection, id } = req.params;
    const { data } = req.body;

    if (!data) {
        res.status(400).json({ error: "Missing 'data' in request body" });
        return;
    }

    try {
        const updated = db.updateDocument(collection, id, data);
        if (updated) {
            res.json({ message: "Document successfully updated" });
        } else {
            res.status(404).json({ error: `Document with ID ${id} not found in collection ${collection}` });
        }
    } catch (error) {
        handleError(res, error as Error);
    }
});

// Delete Document by ID
app.delete("/:collection/:id", (req, res) => {
    const { collection, id } = req.params;

    try {
        const deleted = db.deleteDocument(collection, id);
        if (deleted) {
            res.json({ message: "Document successfully deleted" });
        } else {
            res.status(404).json({ error: `Document with ID ${id} not found in collection ${collection}` });
        }
    } catch (error) {
        handleError(res, error as Error);
    }
});

// Server Initialization
app.listen(PORT, () => logger.info(`STARTED: Server running on port ${PORT}, version ${VERSION}`));

let millisecToMinutes = 1000 * 60;
setInterval(() => {
    logger.info(`STATUS Server is fine. Uptime : ${getUptime(STARTTIME)}`)
}, 5 * millisecToMinutes) // put time in minutes