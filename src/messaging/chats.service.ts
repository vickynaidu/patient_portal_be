import { Inject, Injectable } from '@nestjs/common';
import { CreateChatDto } from './schemas/create-chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from './schemas/chat.schemas';
import { Model } from 'mongoose';
import { GetChatDto } from './schemas/get-chat.dto';
import { UserAuthService } from 'src/user-auth/user-auth.service';

@Injectable()
export class ChatsService {

  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @Inject(UserAuthService) private userAuthService: UserAuthService,
  ) { }

  async create(createChatDto: CreateChatDto) {
    const senderObject = await this.userAuthService.getUserByEmail(createChatDto.sender_id);
    const receiverObject = await this.userAuthService.getUserByEmail(createChatDto.receiver_id);
    console.log("Saving chat history in")
    return this.chatModel.create({
      sender_id: senderObject,
      receiver_id: receiverObject,
      content: createChatDto.content
    });
  }

  async findAll(sender_id: string, receiver_id: string): Promise<Chat[]> {
    console.log("chatHistory request: ", sender_id, receiver_id);
    const senderChatHistory = await this.chatModel.find({sender_id, receiver_id});
    const receiverChatHistory = await this.chatModel.find({receiver_id: sender_id, sender_id: receiver_id});
    console.log("chatHistory: ", [...senderChatHistory, ...receiverChatHistory]);
    return [...senderChatHistory, ...receiverChatHistory];
  }

  async findAllMyChats(_id: string): Promise<Chat[]> {
    const senderChatHistory = await this.chatModel.find({sender_id: _id});
    const receiverChatHistory = await this.chatModel.find({receiver_id: _id});
    return [...senderChatHistory, ...receiverChatHistory];
  }
}
