import { Document, Types } from 'mongoose';

export interface Review extends Document {
    media: string;
    userId: Types.ObjectId;
    username: string;
    content?: string;
    backdrop_path?: string | null;
    spoiler?: boolean;
    rewatch?: boolean;
    watched_on?: Date;
    rating?: number | null;
    poster_path?: string | null;
    favorite?: boolean;
    name?: string;
    tags: Types.ObjectId[];
    likes?: Types.ObjectId[];
    allowComments?: boolean;
}
