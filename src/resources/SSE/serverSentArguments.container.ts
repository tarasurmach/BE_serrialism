
import {ServerSentEventsService} from "./serverSentEvents.service.js";
import {SSE_TYPES} from "../../utils/types/injection_types.js";

import {ContainerModule } from "inversify"
export const sseContainer = new ContainerModule(bind =>{
    bind<ServerSentEventsService>(SSE_TYPES.SSEService).toConstantValue(new ServerSentEventsService());
})

