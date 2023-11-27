import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import {reviewContainer} from "../../resources/review/review.container.js";
import {ServerSocket} from "../../socket.js";
import "reflect-metadata";
import {sseContainer} from "../../resources/SSE/serverSentArguments.container.js"
import  "../../resources/SSE/serverSentEvents.controller.js"
import {notificationContainer} from "../../resources/notification/notification.container.js";
export const ExpressServer = Symbol("Server")
import {initializeDbConnection, initializeMiddleware} from "../../app.js";
import {authContainer} from "../../auth/auth.container.js";
import {createServer, Server} from "http";
import {tagContainer} from "../../resources/tag/tag.container.js";
import ErrorMiddleware from "../../middleware/error.middleware.js"
export const ServerSocketSymbol = Symbol("ServerSocket")
export  async function bootstrap() {
    const container = new Container();
    container.load(notificationContainer)
    container.load(reviewContainer);
    //container.load(socketContainer);
    container.load(sseContainer);
    container.load(authContainer)
    container.load(tagContainer)
    const server = new InversifyExpressServer(container, null, {rootPath:"/api/v1"});
    server.setConfig(initializeMiddleware);
    server.setErrorConfig(app => {
        app.use(ErrorMiddleware)
    })
    const httpServer:Server = createServer(server.build())
    //container.bind<Server>(ExpressServer).toConstantValue(httpServer)
    //container.bind<ServerSocket>(ServerSocketSymbol).to(ServerSocket).inSingletonScope()

    // container.bind<ServerSocket>("ServerSocket").toDynamicValue(ctx=>{
    //     const serv = ctx.container.get<Server>(ExpressServer);
    //     return new ServerSocket(serv)
    // })
    //container.get<ServerSocket>(ServerSocketSymbol)
    await initializeDbConnection()
    return httpServer;




}
