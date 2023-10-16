import {model, Model, Schema} from "mongoose";
import User from "resources/user/user.interface.js";

const userSchema = new Schema<User>({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    roles: [
        {
            type: String,
            default: "User",
        },
    ],
    tags: [
        {
            type: Schema.Types.ObjectId,
            ref: "Tag",
            default: [],
        },
    ],
    imgUrl: {
        type: String,
        default: null,
    },
    bio: {
        type: String,
        default: null,
        maxLength: 150,
    },
}, {timestamps:true})
const UserModel = model<Schema<User>>("User", userSchema);
export default UserModel;