import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './schemas/room.schemas';
import { ChatModule } from 'src/messaging/chat.module';
import { JwtModule } from '@nestjs/jwt';
import { secret } from 'src/user-auth/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    JwtModule.register({
      secret: secret.secret,
      signOptions: { expiresIn: secret.authTokenExp }, 
    }),
    ChatModule,
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule { }
