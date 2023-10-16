import { Types, Document } from 'mongoose';

export interface Notification extends Document {
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    contentType: 'Comment' | 'Review' | 'List' | 'User';
    actionType: 'Follow' | 'Like' | 'Comment' | 'Reply';
    senderPic?: string;
    read: boolean;
    username:string;
    documentId?:string
}

