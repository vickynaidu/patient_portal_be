import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserAuthController } from './user-auth.controller';
import { UserAuthService } from './user-auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user-auth.schema';
import { secret } from './config'; 
import { RoleService } from 'src/roles/role.service';
import { RoleModule } from 'src/roles/role.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.register({
      secret: secret.secret,
      signOptions: { expiresIn: secret.authTokenExp }, 
    }),
    RoleModule
  ],
  controllers: [UserAuthController],
  providers: [UserAuthService],
  exports: [UserAuthService],
})
export class UserAuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
   }
}