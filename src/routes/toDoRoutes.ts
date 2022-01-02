import express, { Router } from 'express';

import { Nullable, HttpResponse } from '../util/types';
import { ToDoListRowSchema } from '../database/SqlTableTypes';
import { Logger, LogType } from '../util/Logger';

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
}