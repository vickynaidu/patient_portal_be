import { Body, Controller, Get, Param, Post, Query, Req, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/user-auth/auth-guard';
import { ChatsService } from 'src/messaging/chats.service';
import { GetChatDto } from 'src/messaging/schemas/get-chat.dto';
import { CreateChatDto } from './schemas/create-chat.dto';
import { Chat } from './schemas/chat.schemas';

@ApiTags('chat')
@Controller('chat')
export class ChatController {

  constructor(
    private readonly chatsService: ChatsService,
  ) { }

  @Get('history/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'Receiver user id' })
  async getChats(@Req() req: Request, @Param('id') id?: string): Promise<Chat[]> {
    console.log("request: ", req["user"]["userId"]);
    const chatHistory = await this.chatsService.findAll(id, req["user"]["userId"]);
    return chatHistory;
  }
  @Get('')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getMyChats(@Req() req: Request): Promise<Chat[]> {
    console.log("request: ", req["user"]["userId"]);
    const chatHistory = await this.chatsService.findAllMyChats(req["user"]["userId"]);
    return chatHistory;
  }
}
