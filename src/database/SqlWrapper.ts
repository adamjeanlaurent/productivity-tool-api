import mysql, { Pool, RowDataPacket, FieldPacket } from 'mysql2/promise';

import config from "../Config";
import { Nullable, QueryParams } from '../util/types';
import { Logger, LogType } from '../util/Logger';
 
class SqlWrapper {
    private connection: Nullable<Pool> = null;

    connect = (): void => {
        try {
            if(!config.DB_HOST || !config.DB_USER || !config.DB_PASS || !config.DB_DATABASE) {
                throw new Error('missing database credentials');
            }

            this.connection = mysql.createPool({
                host: config.DB_HOST,
                user: config.DB_USER,
                password: config.DB_PASS,
                database: config.DB_DATABASE
            });
        }

        catch(error: any) {
            Logger.error(error.message, LogType.Internal);
            this.connection = null;
        }
    }

    // https://github.com/mysqljs/mysql/issues/708
    isConnected = async (): Promise<boolean> => {
        try {
            await this.connection!.getConnection();
            return true;
        }
        
        catch {
            return false;
        }
       
    }

    runQuery = async <TableType extends RowDataPacket>(query: string, params: QueryParams = []): Promise<TableType[]> => {
        try {
            const [rows]: [ TableType[], FieldPacket[] ] = await this.connection!.execute<TableType[]>(query, params);
            return rows;
        }

        catch(error: any) {
            Logger.error(error.message, LogType.Internal);
            return [];
        }
    }
}

const db = new SqlWrapper();

export default db;