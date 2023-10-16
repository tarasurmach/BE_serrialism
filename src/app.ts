import {Application, NextFunction} from 'express';
import * as mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import ErrorMiddleware from './middleware/error.middleware.js';
import bodyParser from "body-parser";
import helmet from 'helmet';
import {catchErrors} from "./middleware/tryCatch.middleware.js";

export function initializeMiddleware(app:Application) {
    app.use(helmet());
    app.use(cors({
        origin:'http://localhost:5173',
        credentials:true
    }));
    app.use(morgan('tiny'));
    /*app.use((req, res, next) => {
        const wrappedMiddleware = catchErrors((req:Request, res:Response, next:NextFunction) => {
            // Your route handler logic here
        });
        return wrappedMiddleware(req, res, next);
    })*/
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended:true
    }))


    app.use(ErrorMiddleware);

}
export async function initializeDbConnection(): Promise<void> {
    const { MONGO_URL } = process.env;
    await mongoose.connect(`mongodb://${MONGO_URL as string}`);
}