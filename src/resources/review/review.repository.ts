import { MongoRepository } from '../../utils/repositories/base.repository.js';
import { Review } from '../../resources/review/review.interface.js';
import {FilterQuery, Model, Types} from 'mongoose';
import { injectable } from 'inversify';
import HttpException from "../../utils/exceptions/http.exception.js";
@injectable()
export class ReviewRepository extends MongoRepository<Review> {
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

