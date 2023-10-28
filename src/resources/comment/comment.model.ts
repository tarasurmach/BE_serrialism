import mongoose, {Schema, Types} from "mongoose";
import {Comment} from "./comment.interface.js";

const commentSchema = new Schema<Comment>({
    text: {
        type: String,
        required: true,
        maxLength:500
    },
    userId: {
        type: Types.ObjectId,
        ref:"User",
        required: true
    },
    review: {
        type: Types.ObjectId,
        refPath: 'model',
        required: true
    },
    model:{
        type:String,
        enum:["Review", "List"],
        default: "Review"
    },
    replies: [
        {
            type: Types.ObjectId,
            ref: 'Comment',
            default: [],
        },
    ],
    parent:{
        type:Types.ObjectId,
        ref:"Comment",
        default:null
    },
    username:{
        type:String,
        required:true
    },
    likes:[{
        type:Types.ObjectId,
        ref:"User",
        default: []

    }]
}, {timestamps:true});
export const CommentModel = mongoose.model<Comment>("Comment", commentSchema)