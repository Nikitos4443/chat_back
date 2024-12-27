import {
  ConnectedSocket, MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";

@WebSocketGateway(3002, {cors: {origin: '*'}})
export class ChatGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('join-room')
  handleJoinRoom(@MessageBody() details: {clientName: string, roomId: string}, @ConnectedSocket() client: Socket): any {
    client.join(details.roomId);

    client.to(details.roomId).emit('user-joined', `User ${details.clientName} has joined the room`);
  }

  @SubscribeMessage('send-message')
  handleSendMessage(@MessageBody() details: {clientName: string, message: any, roomId: string}, @ConnectedSocket() client: Socket) {

    client.to(details.roomId).emit('reply', {client: details.clientName, message: details.message});
  }

  @SubscribeMessage('user-left')
  handleUserLeft(@MessageBody() details: {clientName: string, roomId: string}, @ConnectedSocket() client: Socket) {

    console.log("disconnected")
    client.to(details.roomId).emit('user-leave', `User ${details.clientName} has left the room`);
  }
}