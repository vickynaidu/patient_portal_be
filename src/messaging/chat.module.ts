import { forwardRef, Module } from '@nestjs/common';
import { MessagingGateway } from './chat.gateway';
import { ChatsService } from './chats.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schemas/chat.schemas';
import { UserAuthModule } from 'src/user-auth/user-auth.module';
import { ChatController } from './chat.controller';
import { JwtModule } from '@nestjs/jwt';
import { secretKey } from 'src/user-auth/config';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
        forwardRef(() => UserAuthModule),
        JwtModule.register({
            secret: secretKey.secret,
            signOptions: { expiresIn: '1h' },
        }),
    ],
    providers: [
        MessagingGateway,
        ChatsService,
    ],
    controllers: [ChatController],
    exports: [ChatsService],
})
export class ChatModule { }
