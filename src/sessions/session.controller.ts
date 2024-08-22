import { Controller, Post, Body, Get, UseGuards, Req, Put, Query, Param } from '@nestjs/common';
import { AuthGuard } from '../user-auth/auth-guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { SessionService } from './session.service';
import { SessionDto } from './schemas/session.dto';
import { Session } from './schemas/session.schema';

@ApiTags('Sessions')
@Controller('')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @ApiOperation({summary: 'Create session' })
  @ApiResponse({ status: 200, description: 'Success' })
  @Post('session')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async createSession(@Body() body: SessionDto): Promise<{ message: string }> {
    console.log("Body: ", body);
    await this.sessionService.createSession(body);
    return { message: 'User registered successfully' };
  }

  @Put('session')
  @ApiOperation({summary: 'Update session' })
  @ApiResponse({ status: 200, description: 'Success' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async updateSession(@Body() body: SessionDto): Promise<{ message: string }> {
    const message = await this.sessionService.updateSession(body);
    return message;
  }

  @Get('sessions')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getSessions(@Req() request: Request): Promise<Session[]> {
    console.log("request: ", request["user"]["userId"]);
    const sessions = this.sessionService.getSessions(request['user']["userId"]);
    return sessions;
  }

  @Get('session/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'Session id' })
  getExampleData(@Param('id') id?: string): Promise<Session> {
    console.log("request: ", id);
    return this.sessionService.getSession(id);
  }
}