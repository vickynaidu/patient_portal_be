import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from './chats.service';

@WebSocketGateway({ namespace: '/chat' })
export class MessagingGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private readonly chatsService: ChatsService,
      ) { }


    @WebSocketServer() server: Server;

    private clients: Map<string, Socket> = new Map(); // userId -> socketId

    afterInit(server: Server) {
        console.log('WebSocket initialized');
    }

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    @SubscribeMessage('register')
    handleRegister(@MessageBody() userId: string, @ConnectedSocket() client: Socket): void {
        // Store the client socket with their user ID
        this.clients.set(userId, client);
        console.log(`User ${userId} connected with socket ID: ${client.id}`);
    }

    @SubscribeMessage('sendMessage')
    handleMessage(@MessageBody() payload: { to: string, message: string }, @ConnectedSocket() client: Socket): void {
        console.log("Payload: ", payload);
        const { to, message } = payload;
        console.log("sending ", message, 'to ', to);
        const senderId = this.getUserIdBySocket(client);
        if (this.clients.has(to)) {
            const peerSocket = this.clients.get(to);
            this.chatsService.create({sender_id: senderId, receiver_id: to, content: message}).then(res => {
                console.log("chat message saved to chat collection", res);
                peerSocket.emit('receiveMessage', { from: senderId, message });
                console.log(`Message from ${senderId} to ${to}: ${message}`);
            });
        } else {
            console.log(`User ${to} not found`);
        }
    }

    private getUserIdBySocket(socket: Socket): string | undefined {
        // Find the user ID by their socket
        for (const [userId, clientSocket] of this.clients.entries()) {
            if (clientSocket.id === socket.id) {
                return userId;
            }
        }
        return undefined;
    }

    // Handle disconnection
    handleDisconnect(client: Socket) {
        const userId = this.getUserIdBySocket(client);
        if (userId) {
            this.clients.delete(userId);
            console.log(`User ${userId} disconnected`);
        }
    }
}
