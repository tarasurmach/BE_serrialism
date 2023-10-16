import {ObjectId, Document} from "mongoose";

export interface ITag extends Document{
    item:ObjectId[],
    tag:string,
    user:ObjectId[],
    type?:"Review"|"List"
}