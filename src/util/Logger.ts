import { httpLogsFilename, internalLogsFilename } from "./constants";
import FileSystem from "./FileSystem";
import Time from "./Time";

export enum LogType {
    Internal, // for logging internal work the service is doing
    Http // for logging http requests and responses
}

export class Logger {
    private static shouldLogToFile: boolean = (true || process.env.DEV_ENV == 'production');

    static warning(log: string, logType: LogType): void {
        this.logInternal(log, logType, 'Warning');
    }

    static error(log: string, logType: LogType): void {
        this.logInternal(log, logType, 'Error');
    }

    static checkpoint(log: string, logType: LogType): void {
        this.logInternal(log, logType, 'Checkpoint');
    }

    private static logInternal(log: string, logType: LogType, logPrefix: string): void {
        // parse full log
        const fullLog: string = `${Time.getTimeStamp(new Date())} ${logPrefix}: ${log}`;

        // if in production, we should log to file
        if(this.shouldLogToFile) {
            let filename: string = '';
            switch(logType) {
                case LogType.Http:
                    filename = httpLogsFilename;
                        break;
                    case LogType.Internal:
                        filename = internalLogsFilename;
                        break;
                    default:
                        filename = internalLogsFilename;
                        break;
            }
            this.logToFile(filename, fullLog);
        }

        // if not in production we should log to the console
        else {
            console.log(fullLog);
        }
    }

    private static logToFile(filename: string, log: string): void {
        // can't log to a non-existent file :p
        if(filename.length === 0) {
            return;
        }

        const filepath: string = `./logs/${filename}`;
        FileSystem.write(filepath, log);
    }
}