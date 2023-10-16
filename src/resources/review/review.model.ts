import mongoose, {Schema} from "mongoose";
import {Review} from "resources/review/review.interface.js";


const ReviewSchema = new Schema<Review>({
    media:{
        type:String,
        required: true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",

    },

    username:{type:String, required: true},
    content:{
        type:String
    },
    backdrop_path:{
        type:String,
        default:null
    },
    spoiler:{
        type:Boolean,
        default:false
    },
    rewatch:{
        type:Boolean,
        default:false
    },
    watched_on:{
        type:Date,
        default:Date.now
    },
    rating:{
        type:Number,
        default: null,
        minValue:1,
        maxValue:10

    },
    poster_path:{
        type:String,
        default:null
    },
    favorite:{
        type:Boolean,
        default:false
    },
    name:String,
    tags:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tag",
        default:[]
    }],
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:[]
    }],
    allowComments:{
        type:Boolean,
        default:true
    }
}, {timestamps:true});

export const ReviewModel =  mongoose.model<Schema<Review>>("Review", ReviewSchema)
