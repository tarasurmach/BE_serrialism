import {MongoRepository} from "../../utils/repositories/base.repository.js";
import {Comment} from "./comment.interface.js";
import {Model, Types} from "mongoose";
import HttpException from "../../utils/exceptions/http.exception.js";

export class CommentRepository extends MongoRepository<Comment> {
    constructor(model:Model<Comment>) {
        super(model);
    }
    updateParentComment(newComment:Comment) {
        return this.findByIdAndUpdate((newComment.parent as unknown) as Types.ObjectId, {$addToSet:{replies:newComment._id}})
    }
    async deleteComment(id:string) {
        const result = await this.findByIdAndDelete(id) as Comment;
        if(!result) throw new HttpException('Unable to delete comment', 400);
        let deleted = result;
        //const stack = [deleted]
        const deleteReplies = async (comment:Comment) => {
            if(!comment.replies) return;
            const replies = await this.find({parent:deleted._id});
            for(let reply of replies) {
                await deleteReplies(reply);
                await this.delete({_id:reply._id});
                //const likes = await this.queryDynamicModel<{item:ObjectId}>("Like", {_id:reply._id});

            }
        }

        await deleteReplies(deleted);
        //await Like.deleteMany();
        /*while(stack.length) {
            const replies = await this.find({parent:deleted._id});
            for (const reply of replies) {
                await this.delete({_id:reply._id});
                stack.push(reply)
            }

        }*/
        await this.findAndUpdate({replies:{$in:[id]}}, {$pull:{replies:deleted._id}});
        return deleted;
    }
    
    async countComments(_id:string) {
        const comments = await this.find({_id});

        const walk = async (comment:Comment, count=0) => {
            count++
            if(!comment.replies) return count;
            const replies = await this.find({parent:comment._id});
            for (const reply of replies) {
                count = await walk(reply, count)
            }
            return count;
        }
        let total = 0;
        for (const comment of comments) {
            total = await walk(comment, total)
        }
    }

}