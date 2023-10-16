import { MongoRepository } from '../../utils/repositories/base.repository.js';
import { Review } from '../../resources/review/review.interface.js';
import {Document, FilterQuery, Model, Query, Schema, Types} from 'mongoose';
import { Filter } from './review.service.js';
import { injectable } from 'inversify';
import HttpException from "../../utils/exceptions/http.exception.js";
@injectable()
export class ReviewRepository extends MongoRepository<FilterQuery<Review>, Review> {
    constructor(private reviewModel: Model<Review>) {
        super(reviewModel);

    }

    async outOfStock(query:FilterQuery<Review>): Promise<boolean> {
        const count = await this.countDocuments(query);
        return count > 0;
    }
    async findReviewByIdAndDelete(id:Types.ObjectId) {
        const deleteResult = await this.findByIdAndDelete(id);
        if(!deleteResult) throw new HttpException("Error deleting review", 400);


        /*await Comment.deleteMany({review:deleteResult?._id});
        await Like.deleteMany({item:deleteResult?._id});*/
        return deleteResult
    }

}

