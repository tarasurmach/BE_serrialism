import {injectable} from "inversify";
import {Response} from "express";
export interface Client {
    userId:string;
    res:Response
}
@injectable()
export class ServerSentEventsService {
    private _clients:Client[] = [];

    constructor() {
    }
    addClient(id:string, res:Response):void {
        console.log(id)
        this._clients.push({userId:id, res})
    }
    removeClient(userId:string):void {
        this._clients = this._clients.filter(client=> userId !== client.userId)
    }
    isActive(userId:string):boolean {
        return this._clients.some(client => userId === client.userId)
    }
    sendEventToClient(res:Response, eventType: string, eventData:string, ):void{
        const eventString = `event: ${eventType}\ndata: ${eventData}\n\n`
        res.write(eventString);
    }
    getClient(userId:string):Client|undefined {
        return this._clients.find(client => userId === client.userId)
    }
}