import {injectable} from "inversify";
import {Model} from "mongoose";
import {Notification} from "../notification/notification.interface.js";
import {MongoRepository} from "../../utils/repositories/base.repository.js";


@injectable()
export class NotificationRepository extends MongoRepository<Notification>{
    constructor(private notificationModel:Model<Notification>) {
        super(notificationModel);
    }

}