import {Document, ObjectId} from 'mongoose';
export interface IComment {
    text: string;
    userId: ObjectId; // Assuming this is the type of a user's ObjectId
    review: ObjectId; // Assuming this is the type of a review's ObjectId
    model: 'Review' | 'List';
    replies: string[]; // Assuming this is the type of a comment's ObjectId
    parent: ObjectId; // Assuming this is the type of a comment's ObjectId or null
    username: string;
    likes: string[];
}
export interface Comment extends IComment, Document {
     // Assuming this is the type of a user's ObjectId
}