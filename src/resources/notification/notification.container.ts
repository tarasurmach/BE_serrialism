import {ContainerModule} from "inversify";
import {Notification_TYPES, SSE_TYPES} from "../../utils/types/injection_types.js";
import {NotificationRepository} from "../notification/notification.repository.js";
import NotificationModel from "../notification/notification.model.js";
import {NotificationService} from "../notification/notification.service.js";
import "../notification/notification.controller.js"
import {ServerSentEventsService} from "../../resources/SSE/serverSentEvents.service.js";
export const notificationContainer = new ContainerModule(bind =>{
    bind<NotificationRepository>(Notification_TYPES.NotificationRepository).toConstantValue(new NotificationRepository(NotificationModel))
    /*bind<NotificationService>(Notification_TYPES.NotificationService).toDynamicValue(ctx=>{
        const repo = ctx.container.get<NotificationRepository>(Notification_TYPES.NotificationRepository);
        const sse = ctx.container.get<ServerSentEventsService>(SSE_TYPES.SSEService)
        return new NotificationService(repo, sse)
    })*/
    bind<NotificationService>(Notification_TYPES.NotificationService).to(NotificationService).inSingletonScope();
    //bind<NotificationService>(Notification_TYPES.NotificationService).to(NotificationService).inSingletonScope()
})