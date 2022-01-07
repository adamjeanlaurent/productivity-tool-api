import { RowDataPacket } from "mysql2";

export interface ToDoListRowSchema extends RowDataPacket {
    toDoItem: string
}

export interface TimerRowSchema extends RowDataPacket {
    date: string,
    sessionType: 'break' | 'work',
    timeSpentSeconds: number
}