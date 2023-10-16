import {inject, injectable} from 'inversify';
import mongoose, {Schema, Types, PopulateOptions} from 'mongoose';
import { ReviewRepository } from './review.repository.js';
import {Notification_TYPES, Review_TYPES as TYPES, Tag_Types, User_TYPES} from "../../utils/types/injection_types.js";
import {NotificationService} from "../notification/notification.service.js";
import {Review} from "../review/review.interface.js";
import HttpException from "../../utils/exceptions/http.exception.js";
import {ExpressUser} from "../../utils/declarations/user.js";
import {UserRepository} from "../user/user.repository.js";
import {TagService} from "../tag/tag.service.js";




const models = ["Watchlist", "Watched", "Favorite"];
export interface Filter {
    type?: string;
    required?: boolean;
    userId?: Schema.Types.ObjectId;
    username?: string;
    content?: string;
    rating?: number | null;
    media?:string
}
@injectable()
export class ReviewService {
    constructor(
        @inject(TYPES.ReviewRepository) private readonly reviewRepository: ReviewRepository,
        @inject(Notification_TYPES.NotificationService) private readonly notifications:NotificationService,
        @inject(User_TYPES.UserRepository) private readonly userRepo:UserRepository,
        @inject(Tag_Types.TagService) private readonly tagService:TagService
        ) {}
    async ofStock(query: Filter): Promise<boolean> {
        return this.reviewRepository.outOfStock(query);
    }
    async createReview(body:Partial<Review>&{tags:string[]}, {username, userId}:ExpressUser):Promise<Review|null> {
        const {content, rating,  media, tags} = body;
        if(!rating || !content) throw new HttpException("You cannot add empty log", 400);
        const userExists = await this.userRepo.findOne({username});
        if(!userExists) throw new HttpException(`User ${username} doesn't exist`, 400);
        const exists = await this.reviewRepository.findOne({$and:[{username}, {media}]});
        if(exists) throw new HttpException("Review exists", 409);
        const res = await this.reviewRepository.create({...body, tags:[], username, userId:(userId as unknown) as Types.ObjectId}) as Review;
        if(!res._id) {
            throw new HttpException("Couldn't create new review", 400)
        }

        /*for await (const model of models) {
            try {
                const Model = mongoose.model(model);
                await Model.findOneAndDelete({$and:[{userId}, {id:media}]}, {reviewed:true})
            }catch (e) {
                console.error(e)
            }
        }*/
        if(tags) {
            res.tags =  await this.tagService.postTags(userId , res._id.toString(), "Review", tags);
        }

        return res;

        /*await this.notifications.createNotification({
                senderId:new Types.ObjectId("614e99c5a04b77c8a081e184"), // Replace with a valid ObjectId
                receiverId: new Types.ObjectId("614e99c5a04b77c8a081e185"), // Replace with a valid ObjectId
                contentType: "Comment", // Should be one of the valid ContentType enum values
                actionType: "Reply", // Should be one of the valid ActionType enum values
                senderPic: "https://example.com/profile.jpg",
                read: false,
                username:"breaklin",
                documentId:res._id.toString()
            })*/
    }
    public async updateReview(dto:Review&{tags:string[]}, {userId}:ExpressUser, id:string):Promise<Review> {
        const {rating, content, tags:newTags} = dto;
        if(!rating && !content) throw new HttpException("Cannot update empty fields", 400);
        let found = await this.reviewRepository.findById(id) as Review;
        if(!found) throw new HttpException("Couldn't find review for update", 404);
        const isAuthor = String(found.userId) === userId;
        console.log(userId + " || " + found.userId)
        if(!isAuthor) throw new HttpException("You cannot update someone else's review", 409);
        const oldTags = found.tags;
        const result:Review = Object.assign(found, {...dto, tags:[]});
        if(newTags.length) {
            result.tags = await this.tagService.handleTags(newTags, "Review", userId, id);
        }
        await result.save();
        if(oldTags.length) {
            const oldTagsToExclude = await this.tagService.handleTagDifference(oldTags, newTags);
            console.log("Tags to exclude: "+oldTagsToExclude)
            const oldTagsIds = oldTagsToExclude.map(tag=> tag._id);
            await this.removeOldTagsReview(oldTagsIds, id, userId)
            /*const removedTags = await this.tagService.handleOldTags(oldTagsIds, id);
            console.log("Removed Tags: "+removedTags)
            await Promise.all(removedTags.map(async oldTag => {
                const allTagReviews= await this.reviewRepository.find({_id:{$in:oldTag.item}});
                console.log("Old tag: "+oldTag)
                const atLeastOneUserReview = allTagReviews.find(review=> review.userId.toString() === userId);
                console.log("At least: "+atLeastOneUserReview)
                if(!atLeastOneUserReview) {
                    oldTag.user = oldTag.user.filter(user=> user.toString() !== userId);
                }
                return oldTag.save()
            }))*/
            //console.log("Users tags: "+hmm)

            //const oldTagReviews = await this.reviewRepository.find({_id:{$in:}})
        }
        return result;

    }
    private async removeOldTagsReview(oldTags:Types.ObjectId[], id:string, userId:string) {
        const removedTags = await this.tagService.handleOldTags(oldTags, id);
        console.log("Removed Tags: "+removedTags)
        return Promise.all(removedTags.map(async oldTag => {
            const allTagReviews= await this.reviewRepository.find({_id:{$in:oldTag.item}});
            console.log("Old tag: "+oldTag)
            const atLeastOneUserReview = allTagReviews.find(review=> review.userId.toString() === userId);
            console.log("At least: "+atLeastOneUserReview)
            if(!atLeastOneUserReview) {
                oldTag.user = oldTag.user.filter(user=> user.toString() !== userId);
            }
            return oldTag.save()
        }))
    }
    public async deleteReview(id:string, userId:string) {
        const found = await this.reviewRepository.findById(id);
        if(!found) {
            throw new HttpException("Review not found", 404)
        }
        const isAuthor = found.userId.toString() === userId;
        if(!isAuthor) throw new HttpException("You cannot delete someone else's review", 409);
        const deleteResult = await this.reviewRepository.findReviewByIdAndDelete(found._id);
        if(!deleteResult) throw new HttpException(`Review wasn't deleted`, 500);
        if(deleteResult.tags) {
            await this.removeOldTagsReview(deleteResult.tags, id, userId)
        }

        return deleteResult

    }
    public async getSingleReview(_id:string):Promise<Review|undefined> {
        const res = await this.reviewRepository.findAndPopulate({_id}, [{path:"tags", select:"tag"}, {path:"likes", select:"username imgUrl"}]);
        if(!res) throw new HttpException("Review not found", 404);
        return res
    }


}
