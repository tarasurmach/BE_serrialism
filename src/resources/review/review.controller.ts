import { NextFunction, Request, Response, Router } from 'express';
import { ReviewService } from './review.service.js';
import {controller, httpGet, httpPost, httpPatch, httpDelete, request, requestBody, response, next} from 'inversify-express-utils';
import {inject} from "inversify";
import {Review_TYPES as TYPES} from "../../utils/types/injection_types.js";
import {verifyToken} from "../../middleware/auth.middleware.js";
import {Review} from "./review.interface.js";
@controller('/reviews')
export class ReviewController {
    constructor(@inject(TYPES.ReviewService)private readonly reviewService: ReviewService) {

    }
    @httpGet("/:id")
    private async outOfStock(
        req: Request,
        res: Response,
        next: NextFunction

    ): Promise<Response | void> {
        console.log(req.body);

        try {
            console.log(req.params?.id)
            const result = await this.reviewService.ofStock({
                username: 'breaklin',
            });
            res.status(200).json({ result });
        } catch (e) {
            next(e);
        }
    }

    @httpPost("/", verifyToken)
    private async createReview(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> {
        const result = await this.reviewService.createReview(req.body, req.user) as Review;

        res.status(201).json({message:`New log for ${result.name} successfully added`, result})

    }
    @httpPatch('/:id', verifyToken)
    private async updateReview(
        req: Request,
        res: Response,
        next: NextFunction
    ):Promise<Response|void> {
        console.log(req.user)
        const result = await this.reviewService.updateReview(req.body, req.user, req.params.id);
        res.status(200).json({message:`Review for ${result.name} successfully modified`, result})
    }
    @httpDelete('/:id', verifyToken)
    private async deleteReview(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const result = await this.reviewService.deleteReview(req.params.id, req.user.userId);
        res.status(200).json({message:`Review for ${result.name} successfully removed`});
    }
    @httpGet("/:id")
    private async getSingleReview(
        req:Request,
        res:Response,
        next:NextFunction
    ) {
        const result = await this.reviewService.getSingleReview(req.params.id);
        res.status(200).json({result})
    }

}


