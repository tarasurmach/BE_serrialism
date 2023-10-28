import {inject, injectable} from "inversify";
import {Notification_TYPES, SSE_TYPES} from "../../utils/types/injection_types.js";
import {NotificationRepository} from "../notification/notification.repository.js";
import {Notification} from "../notification/notification.interface.js";
import HttpException from "../../utils/exceptions/http.exception.js";
import {Client, ServerSentEventsService} from "../SSE/serverSentEvents.service.js";
import {Document, FilterQuery} from "mongoose";

interface NotificationWithMessage extends Notification {
    message:string
}

@injectable()
export class NotificationService {
    constructor(
        @inject(Notification_TYPES.NotificationRepository) private repository:NotificationRepository,
        @inject(SSE_TYPES.SSEService) private  readonly sseService:ServerSentEventsService) {}
    public async getAllNotifications(query:FilterQuery<Notification>):Promise<NotificationWithMessage[]| undefined> {
        const res = await this.repository.find(query) as NotificationWithMessage[];
        return res.map(item=> {
            item = item.toObject()
            item.message = generateNotificationMessage(item);
            return item
        })

    }
    public async createNotification(body:Omit<Notification, keyof Document>):Promise<void> {
        const result = await this.repository.create(body) as Notification;
        if(!result) throw new HttpException("Couldn't create a notification", 400);
        const userId = result.receiverId.toString();
        if(!this.sseService.isActive(userId)) return;
        const client = this.sseService.getClient(userId) as Client;
        console.log("sending: ", client.userId)
        const eventType = "message";
        const notificationData = {contentType:result.contentType, actionType:result.actionType, userId:result.receiverId, message:generateNotificationMessage(result), id:result.documentId}
        const eventData = JSON.stringify(notificationData)
        this.sseService.sendEventToClient(client.res, eventType, eventData)
    }
}
const notifActions:Record<Notification["actionType"], string> = {
    Follow:"started following you.",
    Like:"liked your ",
    Comment:"commented on your ",
    Reply:"replied to your comment "
}

function generateNotificationMessage({username, actionType, contentType}:Notification):string {
    let string = `${username} `;
    string += notifActions[actionType];

    if(actionType==="Comment" || actionType === "Like") {
        string += contentType.charAt(0).toLowerCase() + contentType.slice(1);
    }

    return string;

}
