import {Types} from "mongoose";
import {Request as ERequest, RequestParamHandler} from "express"
interface ExpressUser {
    username:string,
    userId:string //| Types.ObjectId
}
declare global {
    namespace Express {
        export interface Request {
            user:ExpressUser
        }
        export interface TypedRequestBody<T extends Object, P extends Object={}, Q extends Object={}> extends ERequest{
            body:T,
            params: ERequest["params"] & P,
            query:ERequest["query"] & Q
        }
    }
}