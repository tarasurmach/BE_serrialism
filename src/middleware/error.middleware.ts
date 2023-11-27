import HttpException from '../utils/exceptions/http.exception.js';
import { NextFunction, Request, Response } from 'express';

export default function (
    error: HttpException,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const status = error.status ?? 500;
    const message = error.message ?? 'Unknown error';
    console.log( "middle")
    res.status(status).json({ message });
}
