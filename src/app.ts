import {Application} from 'express';
import * as mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';

import bodyParser from "body-parser";
import helmet from 'helmet';


export function initializeMiddleware(app:Application) {
    app.use(helmet());
    app.use(cors({
        optionsSuccessStatus: 200,
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "preflightContinue": false,
        origin: ["http://localhost:5174", "http://localhost:5173"],
        credentials:true
    }));
    app.use(morgan('tiny'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended:true
    }))
}
export async function initializeDbConnection(): Promise<void> {
    const { MONGO_URL } = process.env;
    await mongoose.connect(`mongodb://${MONGO_URL as string}`);
}