import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/user-auth/auth-guard';
import { ChatsService } from 'src/messaging/chats.service';
import { GetChatDto } from 'src/messaging/schemas/get-chat.dto';

@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {

  constructor(
    private readonly roomsService: RoomsService,
    private readonly chatsService: ChatsService,
  ) { }

  @ApiOperation({summary: 'Register User' })
  @ApiResponse({ status: 200, description: 'Success' })
  @Post()
  @UseGuards(AuthGuard)
  create(@Request() req, @Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(req["user"]["userId"], createRoomDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  getByRequest(@Request() req) {
    return this.roomsService.getByRequest(req["user"]["userId"]);
  }

  // @Get(':id/chats')
  // @UseGuards(AuthGuard)
  // @ApiParam({ name: 'id', required: true })
  // getChats(@Param('id') id, @Query() dto: GetChatDto) {
  //   return this.chatsService.findAll(id, new GetChatDto(dto));
  // }
}
