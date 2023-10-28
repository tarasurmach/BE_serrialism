import {inject, injectable} from "inversify";
import {Comment_Types} from "../../utils/types/injection_types.js";
import {CommentRepository} from "./comment.repository.js";
import {Comment, IComment} from "./comment.interface.js";
import {Review} from "../review/review.interface.js";
import HttpException from "../../utils/exceptions/http.exception.js";

@injectable()
export class CommentService {
    constructor(@inject<CommentRepository>(Comment_Types.CommentRepository) private commentRepo:CommentRepository) {
    }
    async addComment(dto:IComment) {
        const [item] = await this.commentRepo.queryDynamicModel<Review>(dto.model, {_id:dto.review});
        if(!item || !item.allowComments) throw new HttpException("Cannot add comment to this " + dto.model, 400);
        const newComment = await this.commentRepo.create(dto);
        if (!newComment) throw new HttpException("Unable to add comment", 400);
        if(newComment.parent) {
            await this.commentRepo.updateParentComment(newComment)
        }
        return newComment;

    }
    async editComment({_id, text}:Partial<Comment>) {
        if(!text) throw new HttpException("Comment cannot be empty", 400);
        const updated = await this.commentRepo.findByIdAndUpdate(_id, {$set:{text}});
        if(!updated) throw new HttpException("Error editing comment", 400);
        return updated;
    }
    deleteComment(id:string):Promise<Comment> {
        return this.commentRepo.deleteComment(id);
    }
    getComments(review:string, page=1) {
        return this.commentRepo.paginate({filter:{review, }, page, limit:10 });
    }
    getReplies(item:string) {
        return this.commentRepo.findAndPopulate({parent:item}, {path:"userId", select:"imgUrl"});
    }
    getCount(item:string) {
        return this.commentRepo.countComments(item);
    }

}