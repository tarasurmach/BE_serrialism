import {controller, httpGet, httpPost} from "inversify-express-utils";
import {inject} from "inversify";
import {Notification_TYPES} from "../../utils/types/injection_types.js";
import {NotificationService} from "../notification/notification.service.js";

import {NextFunction, Request, Response} from "express";
import {Types} from "mongoose";
import {tryCatch} from "../../utils/decoratorTest.js";
interface GetAll {

}
@controller("/notifications")
export class NotificationController  {
    constructor(@inject(Notification_TYPES.NotificationService) private service: NotificationService){
    }
    //@tryCatch(404)
    @httpGet("/:id")
    private async getAll(req:Express.TypedRequestBody<GetAll>, res:Response, next:NextFunction):Promise<Response | void> {console.log("shit")
        const result = await this.service.getAllNotifications({receiverId:new Types.ObjectId(req.params.id)});
        console.log(result, "RESULT")
        res.status(200).json({result})
    }




}