import {Types, Document, Schema} from "mongoose";

export default interface User extends Document {
    username: string;
    email: string;
    password: string;
    roles: string[];
    tags: Schema.Types.ObjectId[];
    imgUrl: string | null;
    bio: string | null;
}