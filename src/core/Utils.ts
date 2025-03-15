import path from "path";
import fs from 'fs';
import logger from "../core/Logger";

export function getUptime(startTime: number) {
    // get the start time and generate an uptime message
    let now = Date.now();
    let difference = Math.floor((now - startTime) / 1000)
    return toCleanTime(difference)
}

function toCleanTime(time: number) {
    // convert a second amount into hours minutes and seconds
    let timeSeconds = time % 60
    let timeMinutes = Math.floor(time / 60 % 60)
    let timeHours = Math.floor(time / 3600)
    return `${formated(timeHours)}H ${formated(timeMinutes)}M ${formated(timeSeconds)}S`
}

function formated(num: number) {
    // add a zero infront of to small numbers
    let str = `${num}`
    if (num < 10) { str = `0${num}` }
    return str
}


 // Function to get the most recent log file
export function getLatestLogFile(directory: string): string | null {
    try {
        const files = fs.readdirSync(directory);
        const logFiles = files
            .map(file => ({
                file,
                time: fs.statSync(path.join(directory, file)).mtime.getTime()
            }))
            .sort((a, b) => b.time - a.time); // Sort by most recent

        return logFiles.length > 0 ? path.join(directory, logFiles[0].file) : null;
    } catch (error) {
        logger.error("Error reading log directory: " + error);
        return null;
    }
}