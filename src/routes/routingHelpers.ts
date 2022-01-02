import express, { Response } from 'express';

import { HttpResponse } from '../util/types';
import { Logger, LogType } from '../util/Logger';
import { HttpStatusCode } from '../util/constants';

export const sendErrorResponse = (error: string, res: Response, response: HttpResponse): void => {
    Logger.warning(error, LogType.Internal);
    
    response.errors.push(error);
    res.status(HttpStatusCode.BAD_REQUEST);
}