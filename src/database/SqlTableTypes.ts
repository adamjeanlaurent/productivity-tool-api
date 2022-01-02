import { RowDataPacket } from "mysql2";

export interface ToDoListRowSchema extends RowDataPacket {
    toDoItem: string
}