import { Router } from 'express';

import { Nullable, HttpResponse, QueryParams, TimeReport } from '../util/types';
import { TimerRowSchema } from '../database/SqlTableTypes';
import { Logger, LogType } from '../util/Logger';
import db from '../database/SqlWrapper';
import { HttpStatusCode } from '../util/constants';
import { sendErrorResponse } from './routingHelpers';
import { RowDataPacket } from "mysql2";

const router: Router = Router();

router.get('/read/timerData', async (req, res) => {
    let response: HttpResponse = { errors: [] };

    const timerData = await getTimerData();

    response.results = timerData;

    res.status(HttpStatusCode.OK);
    return res.send(response);
});

router.post('/write/timerData', async (req, res) => {
    let response: HttpResponse = { errors: [] };

    const { sessionType, timeSpent, date }: { sessionType: 'break' | 'work', timeSpent: number, date: string } = req.body;

    if(!sessionType || !timeSpent || !date) {
        sendErrorResponse('missing args', res, response);
        return res.send(response);
    }
    
    await saveTimerData(timeSpent, sessionType, date);

    res.status(HttpStatusCode.CREATED);
    return res.send(response);
});


router.post('/read/timerDataReportByDate', async (req, res) => {
    let response: HttpResponse = { errors: [] };
    const { date }: { date: string } = req.body;

    if(!date) {
        sendErrorResponse('passed an empty date', res, response);
        return res.send(response);
    }
    
    const timerDataByDate: TimerRowSchema[] = await getTimerDataByDate(date);

    const timeReport: TimeReport = await generateTimeReport(timerDataByDate);

    response.results = timeReport;

    res.status(HttpStatusCode.OK);
    return res.send(response);
});

const saveTimerData = async (timeSpent: number, sessionType: 'break' | 'work', date: string): Promise<void> => {
    const query: string = `INSERT INTO TimerData VALUES ('?', '?', '?')`;
    await db.runQuery(query, [date, sessionType, timeSpent]);
}

const getTimerData = async (): Promise<TimerRowSchema[]> => {
    const query: string = 'SELECT * FROM TimerData';
    return db.runQuery<TimerRowSchema>(query);
}

const getTimerDataByDate = async (date: string): Promise<TimerRowSchema[]> =>  {
    const query: string = `SELECT * FROM  TimerData WHERE date='?'`;
    return await db.runQuery<TimerRowSchema>(query, [date]);
}

const generateTimeReport = async (timerData: TimerRowSchema[]): Promise<TimeReport> => {
    let timeReport: TimeReport = { 
        breakInMinutes: '',
        workInMinutes: '',
        breakInHours: '',
        workInHours: '',
        firstLogTimeStamp: '',
        lastLogTimeStamp: '',
        totalTimeTrackedHours: 0
    };

    let totalWorkTimeSeconds: number = 0;
    let totalBreakTimeSeconds: number = 0;
    
    for(let entry of timerData) {
        if(entry.sessionType === 'break') {
            totalBreakTimeSeconds += entry.timeSpentSeconds;
        }
        else if(entry.sessionType === 'work') {
            totalWorkTimeSeconds += entry.timeSpentSeconds;
        }
        else {
            Logger.warning(`invalid session type ${entry.sessionType}`, LogType.Internal);
        }
    }

    timeReport.breakInMinutes = (totalBreakTimeSeconds / 60).toFixed(2);
    timeReport.workInMinutes = (totalWorkTimeSeconds / 60).toFixed(2);
    timeReport.breakInHours = (parseInt(timeReport.breakInMinutes) / 60).toFixed(2);
    timeReport.workInHours = (parseInt(timeReport.workInMinutes) / 60).toFixed(2);

    timeReport.totalTimeTrackedHours = (parseFloat( timeReport.workInHours) + parseFloat(timeReport.breakInHours));

    return timeReport;
}

export default router;