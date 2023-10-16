import {Schema, model} from "mongoose";
import {ITag} from "./tag.interface.js";

const tagSchema = new Schema<ITag>({
    item:[{
        type:Schema.Types.ObjectId,
        refPath:"type"
    }],
    tag:{
        type:String,
        required: true,
        unique:false
    },
    user:[{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"User"
    }],
    type:{
        type:String,
        required: true,
        enum:["Review", "List"],
        default:"Review"
    }
})
tagSchema.index({tag:1, type:1}, {unique:true})
export const TagModel = model<Schema<ITag>>("Tag", tagSchema)