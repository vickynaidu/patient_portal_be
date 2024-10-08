import { Injectable, NotFoundException, Logger, UnauthorizedException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user-auth.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/roles/schemas/role.schema';
import { RoleService } from 'src/roles/role.service';
import { secret } from './config';


@Injectable()
export class UserAuthService {
  private readonly logger = new Logger(UserAuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    @Inject(RoleService) private readonly roleService: RoleService
  ) {}
  
  async registerUser(data): Promise<{ message: string }> {
    try {
      console.log("register user: ", data);
      const roleObj = await this.roleService.getRoleByName(data.role);
      const hash = await bcrypt.hash(data.password, 10);
      data.role = roleObj;
      await this.userModel.create(data);
      return { message: 'User registered successfully' };
    } catch (error) {
      console.log("Error: ", error);
      throw new Error('An error occurred while registering the user');
    }
 }
  async loginUser(email: string, password: string): Promise<{authToken: string, refreshToken: string}> {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      console.log("PasswordMatch: ", passwordMatch);
      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid login credentials');
      }
      const payload = { userId: user._id };
      const authToken = this.jwtService.sign(payload); 
      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: secret.refreshTokenExp,
        secret: secret.secret, // Use a different secret key if desired
      });
      return {authToken, refreshToken};
    } catch (error) {
      console.log(error.response.message);
      throw new UnauthorizedException(error?.response?.message || 'An error occurred while logging in');
    }
  }
  async refreshTokens(_id: string, refresh_token: string) {
    try {
      const user = await this.userModel.findOne({ _id });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const payload = { userId: user._id };
      const authToken = this.jwtService.sign(payload); 
      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: secret.refreshTokenExp
      });
      return {authToken, refreshToken};
    } catch (error) {
      console.log(error.response.message);
      throw new UnauthorizedException(error?.response?.message || 'An error occurred while logging in');
    }
  }
  async getUsers(): Promise<User[]> {
    try {
      const users = await this.userModel.find({});
      return users;
    } catch (error) {
      this.logger.error(`An error occurred while retrieving users: ${error.message}`);
      throw new Error('An error occurred while retrieving users');
    }
  }
  async getUserProfile(_id): Promise<User> {
    try {
      const profile = await this.userModel.findOne({ _id }).populate("role");
      console.log("profile obj: ", profile);
      return profile;
    } catch (error) {
      this.logger.error(`An error occurred while retrieving users: ${error.message}`);
      throw new Error('An error occurred while retrieving users');
    }
  }
  async getUserByEmail(email): Promise<User> {
    try {
      const profile = await this.userModel.findOne({ email });
      return profile;
    } catch (error) {
      this.logger.error(`An error occurred while retrieving users: ${error.message}`);
      throw new Error('An error occurred while retrieving users');
    }
  }
}