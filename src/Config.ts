import dotenv from 'dotenv';

import { Nullable } from './util/types';

dotenv.config();

class Config {
    // Database
    DB_HOST: string = process.env.DB_HOST!;
    DB_USER: string = process.env.DB_USER!;
    DB_PASS: string = process.env.DB_PASS!;
    DB_DATABASE: string = process.env.DB_DATABASE!;

    // Server
    SERVER_PORT: Nullable<number> = parseInt(process.env.PORT!);

    // Basic
    IN_PROD: boolean = (process.env.DEV_ENV === 'production');
}

const config = new Config();

export default config;