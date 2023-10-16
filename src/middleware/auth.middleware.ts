import {NextFunction, Request, Response} from "express";
import HttpException from "../utils/exceptions/http.exception.js";
import jwt, {UserIDJwtPayload, VerifyErrors} from "jsonwebtoken"
import {Types} from "mongoose";
declare module 'jsonwebtoken' {
    export interface UserIDJwtPayload extends jwt.JwtPayload {
        userId: string,
        username:string
    }
}
export function verifyToken(req:Request, res:Response, next:NextFunction) {
    const authHeader = req.headers.authorization ?? req.headers["Authorization"] as string;
    if(authHeader && !authHeader.startsWith("Bearer ")) throw new HttpException("No access token", 401);
    const [_, token] = authHeader.split(" ");
    console.log("Token: " + token);
    const userObj = <UserIDJwtPayload>jwt.verify(
        token,
        process.env.ACCESS as string,
    )
    if(!userObj) {
        throw new HttpException("Error verifying token",403)
    }
    req.user = userObj
    console.log("validating token")
    next()

}
