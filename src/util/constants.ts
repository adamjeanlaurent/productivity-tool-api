// logging
export const httpLogsFilename: string = `httpLogs.txt`;
export const internalLogsFilename: string = `internalLogs.txt`;
export const logDirectoryPath: string = `./logs`;

// http
export class HttpStatusCode {
    static OK: number = 200;
    static CREATED: number = 201;
    static BAD_REQUEST: number = 400;
    static INTERNAL_SERVER_ERROR: number = 500;
} 