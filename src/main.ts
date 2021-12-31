import express, { Express } from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import fsSync from 'fs';

import { Logger, LogType } from './util/Logger';
import FileSystem from './util/FileSystem';
import { httpLogsFilename, internalLogsFilename, logDirectoryPath } from './util/constants';
import config from './Config';

import db from './database/SqlWrapper';

const app: Express = express();

var httpLogsAccessStream = fsSync.createWriteStream(path.join(logDirectoryPath, httpLogsFilename), { flags: 'a' });

const attachRoutes = (): void => {
   
}

const attachMiddleware = (): void => {
    app.use(cors());
    app.use(helmet());
    app.use(express.json());

    if(config.IN_PROD) {
        app.use(morgan('combined', { stream: httpLogsAccessStream }));
    }

    else {
        app.use(morgan('combined'));
    }
}

const createLogDirectory = (): void => {
    FileSystem.createDirectory(logDirectoryPath);
    FileSystem.createFile(path.join(logDirectoryPath, httpLogsFilename));
    FileSystem.createFile(path.join(logDirectoryPath, internalLogsFilename));
}

const connectToDb = (): void => {
   db.connect();
   if(!db.isConnected())
   {
       Logger.error('db failed to connect', LogType.Internal);
       throw new Error('db failed to connect');
   }
}

const startServer = (): void => {
    createLogDirectory();

    Logger.checkpoint('doing initital server setup...', LogType.Internal);

    connectToDb();
    attachRoutes();
    attachMiddleware();


    app.listen(config.SERVER_PORT || 3000, () => {
        Logger.checkpoint(`server listening on port ${3000}`, LogType.Internal);
    });
}

startServer();