import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { User } from './schemas/user-auth.schema';
import { AuthGuard } from './auth-guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from './schemas/user-auth.dto';
import { LoginDto } from './schemas/login.dto';
import { Request } from 'express';

@ApiTags('User')
@Controller('auth')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  @ApiOperation({summary: 'Register User' })
  @ApiResponse({ status: 200, description: 'Success' })
  @Post('register')
  async registerUser(@Body() body: UserDto): Promise<{ message: string }> {
    console.log("Body: ", body);
    const { email, password, firstName, lastName, role } = body;
    console.log(email, password, firstName, lastName, role);
    await this.userAuthService.registerUser(email, password, firstName, lastName, role);
    return { message: 'User registered successfully' };
  }

  @Post('login')
  @ApiOperation({summary: 'Login User' })
  @ApiResponse({ status: 200, description: 'Success' })
  async loginUser(@Body() body: LoginDto): Promise<{ message: string; token: string }> {
    const { email, password } = body;
    const token = await this.userAuthService.loginUser(email, password);
    return { message: 'Login successful', token };
  }

  @Get('users')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getUsers(): Promise<User[]> {
    return this.userAuthService.getUsers();
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getUserProfile(@Req() request: Request): Promise<User> {
    console.log("request: ", request["user"]["userId"]);
    return this.userAuthService.getUserProfile(request['user']["userId"]);
  }
}