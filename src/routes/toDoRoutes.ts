import express, { Router } from 'express';

import { Nullable, HttpResponse, QueryParams } from '../util/types';
import { ToDoListRowSchema } from '../database/SqlTableTypes';
import { Logger, LogType } from '../util/Logger';
import db from '../database/SqlWrapper';

const router = express.Router();

router.post('toDoList/write', async (req, res) => {
    const { toDoList }: { toDoList: Nullable<string[]> } = req.body;
    
    let response: HttpResponse = { errors: [] };

    if(!toDoList) {
        const error = 'to do list empty request';
        Logger.warning(error, LogType.Internal);
        
        response.errors.push('to do list empty request');

        return res.send(response);
    }

    saveToDoItems(toDoList);

    return res.send(response);
});

const saveToDoItems = async (toDoList: string[]): Promise<void> => {
    // build big insert statement
    // execute it

    let query: string = 'INSERT INTO ToDoItems (toDoItem) VALUES ';
    let params: QueryParams = [];

    for(let i = 0; i < toDoList.length; i++) {
        query += `('?')`;
        params.push(toDoList[i]);
        (i == toDoList.length - 1) ? query += ';' : query += ',';
    }

    await db.runQuery<ToDoListRowSchema>(query, params);
}