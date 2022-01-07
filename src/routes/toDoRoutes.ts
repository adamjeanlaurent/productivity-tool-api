import { Router } from 'express';

import { Nullable, HttpResponse, QueryParams } from '../util/types';
import { ToDoListRowSchema } from '../database/SqlTableTypes';
import { Logger, LogType } from '../util/Logger';
import db from '../database/SqlWrapper';
import { HttpStatusCode } from '../util/constants';
import { sendErrorResponse } from './routingHelpers';

const router = Router();

router.post('write/toDoItems', async (req, res) => {
    const { toDoList }: { toDoList: Nullable<string[]> } = req.body;
    
    let response: HttpResponse = { errors: [] };

    if(!toDoList) {
      sendErrorResponse('to do list empty request', res, response);
      return res.send(response);
    }

    await saveToDoItems(toDoList);

    res.status(HttpStatusCode.CREATED);
    return res.send(response);
});

router.post('write/completedToDoItem', async (req, res) => {
    const { completedToDoItem }: { completedToDoItem: Nullable<string> } = req.body;

    let response: HttpResponse = { errors: [] };

    if(!completedToDoItem) {
        sendErrorResponse('completed to do item empty request', res, response);
        return res.send(response);
    }

    await saveCompletedToDoItem(completedToDoItem);

    res.status(HttpStatusCode.CREATED);
    return res.send(response);
});

router.get('read/toDoItems', async (req, res) => {
    let response: HttpResponse = { errors: [] };

    const toDoItems: ToDoListRowSchema[] = await getToDoItems();

    response.results = toDoItems;

    res.status(HttpStatusCode.OK);
    return res.send(response);
});

router.get('read/toDoItemsByDate', async (req, res) => {
    let response: HttpResponse = { errors: [] };

    const { date }: { date: string } = req.body;

    if(!date) {
        sendErrorResponse('passed an empty date', res, response);
        return res.send(response);
    }

    const toDoItems: ToDoListRowSchema[] = await getToDoItemsByDate(date);

    response.results = toDoItems;

    res.status(HttpStatusCode.OK);
    return res.send(response);
});

router.get('read/completedToDoItems', async (req, res) => {
    let response: HttpResponse = { errors: [] };

    const completedToDoItems: ToDoListRowSchema[] = await getCompletdToDoItems();

    response.results = completedToDoItems;

    res.status(HttpStatusCode.OK);
    return res.send(response);
});

const getToDoItemsByDate = async (date: string): Promise<ToDoListRowSchema[]> => {
    const query = `SELECT * FROM ToDoItem WHERE date = '?'`;
    return db.runQuery<ToDoListRowSchema>(query, [date]);
}

const getCompletdToDoItems = async (): Promise<ToDoListRowSchema[]> => {
    const query = 'SELECT * FROM completedToDoItems';
    return db.runQuery<ToDoListRowSchema>(query);
}

const getToDoItems = async (): Promise<ToDoListRowSchema[]> => {
    const query = 'SELECT * FROM ToDoItem';
    return db.runQuery<ToDoListRowSchema>(query);
}

const saveCompletedToDoItem = async (toDoItem: string): Promise<void> => {
    let query: string = `INSERT INTO completedToDoItems (toDoItem) VALUES ('?')`;
    await db.runQuery(query, [toDoItem]);
}

const saveToDoItems = async (toDoList: string[]): Promise<void> => {
    // delete old to do items
    await db.runQuery('DELETE * FROM ToDoItems');

    let query: string = 'INSERT INTO ToDoItems (toDoItem) VALUES ';
    let params: QueryParams = [];

    for(let i = 0; i < toDoList.length; i++) {
        query += `('?')`;
        params.push(toDoList[i]);
        (i == toDoList.length - 1) ? query += ';' : query += ',';
    }

    await db.runQuery(query, params);
}

export default router;