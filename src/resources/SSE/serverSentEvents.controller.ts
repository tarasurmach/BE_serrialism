
import {Request, Response} from "express";
import {controller, httpGet, response, request} from "inversify-express-utils";
import {inject} from "inversify";
import {SSE_TYPES} from "../../utils/types/injection_types.js";
import {ServerSentEventsService} from "./serverSentEvents.service.js"
@controller("/sse")
export class ServerSentEventsController {
    constructor(@inject(SSE_TYPES.SSEService) private sseService:ServerSentEventsService) {

    }

    @httpGet("/:id")
    private socketConnection(req:Request,res : Response) {
        const headers = {
            'Content-Type': 'text/event-stream', // To tell client, it is event stream
            'Connection': 'keep-alive', // To tell client, not to close connection
            'Cache-Control' : 'no-cache'
        };
        console.log(req.params)
        const userId = req.params.id;
        this.sseService.addClient(userId, res);
        res.writeHead(200, headers);

        /*const interval = setInterval(()=>{
            if(!this.sseService.isActive(userId)) return;
            this.sseService.sendEventToClient(res, "test", JSON.stringify({user:userId}));
        }, 5000)*/
        res.on("close", ()=>{
            console.log("fuck ", userId)
            this.sseService.removeClient(userId);
            //clearInterval(interval)
        })

    }
}