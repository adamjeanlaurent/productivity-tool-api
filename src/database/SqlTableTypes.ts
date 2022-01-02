import { RowDataPacket } from "mysql2";

export interface ToDoListRowSchema extends RowDataPacket {
    completed: boolean,
    toDoItem: string
}