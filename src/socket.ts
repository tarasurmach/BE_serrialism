import {Server, Socket} from "socket.io";
import {ContainerModule, inject, injectable} from "inversify";
import {Server as HTTPServer} from "http";
import {ExpressServer} from "./utils/repositories/bootstrap.js";
@injectable()
export class ServerSocket {

    public io:Server;
    public users:Record<string, string>;
    constructor(@inject(ExpressServer) private server:HTTPServer) {
        this.io = new Server(server, {
            serveClient:false,
            pingInterval:10000,
            pingTimeout:5000,
            cookie:false,
            cors:{
                origin:"*"
            }
        })
        this.users = {};
        this.io.on("connect", this.StartListeners);
        console.log("Socket start")

    }
    StartListeners(socket:Socket) {
        console.log(`Message received from `+ socket.id);
        socket.on("connect", ()=>{
            console.log("socket connect")
        })
        socket.on("handshake", ()=>{
            console.log("Handshaking " + this.users);

        });
        socket.on("disconnect", ()=>{
            console.log("Disconnecting")
        })
    }
}
// export const socketContainer = new ContainerModule(bind=>{
//     bind<HTTPServer>('HTTPServer').toConstantValue(new HTTPServer());
//     bind<Server>('Server').toDynamicValue(ctx => {
//         const httpServer = ctx.container.get<HTTPServer>('HTTPServer');
//         console.log("bind socket")
//         return new Server(httpServer, {
//             // Socket.IO options
//         });
//     });
//     bind<ServerSocket>(ServerSocket).toSelf().inSingletonScope();
//
// })
