import {model, Schema} from "mongoose";
import {Notification} from "../notification/notification.interface.js"
const NotificationSchema = new Schema<Notification>({
    senderId: { type: Schema.Types.ObjectId, required: true },
    receiverId: { type: Schema.Types.ObjectId, required: true },
    contentType: { type: String, enum: ['Comment', 'Review', 'List', 'User'], required: true },
    actionType: { type: String, enum: ['Follow', 'Like', 'Comment', 'Reply'], required: true },
    senderPic: { type: String, required: false },
    read: {type:Boolean, default:false},
    username:{type:String, required:true},
    documentId:{type:Schema.Types.ObjectId, required:false}
}, {timestamps:true});


const NotificationModel = model('Notification', NotificationSchema);

export default NotificationModel;