import express, { Express } from 'express';
import path from 'path';

import { Logger, LogType } from './util/Logger';
import FileSystem from './util/FileSystem';
import { httpLogsFilename, internalLogsFilename, logDirectoryPath } from './util/constants';

const attachRoutes = (): void => {

}

const attachMiddleware = (): void => {

}

const createLogDirectory = (): void => {
    FileSystem.createDirectory(logDirectoryPath);
    FileSystem.createFile(path.join(logDirectoryPath, httpLogsFilename));
    FileSystem.createFile(path.join(logDirectoryPath, internalLogsFilename));
}

const connectToDb = (): void => {
   
}

const startServer = (): void => {
    createLogDirectory();
}