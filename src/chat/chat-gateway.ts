import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";

@WebSocketGateway(3002, {cors: {origin: '*'}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: any): any {
    console.log("New user connected", client.id)

    client.broadcast.emit('user-joined', {
      message: `New user joined ${client.id}`,          // Цей метод відправляє всім,окрім відправника
    })
  }

  handleDisconnect(client: any): any {
    console.log("User disconnected", client.id)
  }

  @SubscribeMessage('newMessage')
  handleNewMessage(client: Socket, message: any) {
    console.log(message);

    //this.server.emit('reply', message);
    client.broadcast.emit('reply', message);
  }
}