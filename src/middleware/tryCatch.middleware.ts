import { Request, Response, NextFunction } from "express";

export const catchErrors = (fn: Function) => async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log("shit", fn.length)
    try {
        console.log("catching error")

        await fn(req, res, next);
        next()

    } catch(err) {
        next(err);
    }
}