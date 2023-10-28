import {controller, httpDelete, httpGet, httpPatch, httpPost} from "inversify-express-utils";
import {inject} from "inversify";
import {CommentService} from "./comment.service.js";
import {Comment_Types} from "../../utils/types/injection_types.js";
import {NextFunction, Request, Response} from "express";
import {verifyToken} from "../../middleware/auth.middleware.js";

@controller("/comment")
export class CommentController {
    constructor(@inject<CommentService>(Comment_Types.CommentService) private commentService:CommentService) {
    }
    @httpPost("/", verifyToken)
    private async postComment(
        req:Request,
        res:Response,
        next:NextFunction
    ) {
        const result = await this.commentService.addComment({...req.user, ...req.body});
    }
    @httpPatch("/")
    private async patchComment(
        req:Request,
        res:Response,
        next:NextFunction
    ) {
        const result = await this.commentService.editComment(req.body);
        res.status(200).json({result})
    }
    @httpDelete("/:id")
    private async deleteComment(
        req:Request,
        res:Response,
        next:NextFunction
    ) {
        const result = await this.commentService.deleteComment(req.params.id);
        res.status(200).json({message:'Comment successfully removed', result});
    }
    @httpGet("/:page/:is")
    private async getComments(
        req:Request,
        res:Response,
        next:NextFunction
    ) {
        const result = await this.commentService.getComments(req.params.id, +req.params.page);
        res.status(200).json(result)
    }
}