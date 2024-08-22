import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { secretKey } from 'src/user-auth/config';
import { UserAuthModule } from 'src/user-auth/user-auth.module';
import { Doctor, DoctorSchema } from './schemas/doctor.schema';
import { DoctorService } from './doctor.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Doctor.name, schema: DoctorSchema }
    ]),
    JwtModule.register({
      secret: secretKey.secret,
      signOptions: { expiresIn: '1h' }, 
    }),
    UserAuthModule
  ],
  controllers: [DoctorController],
  providers: [DoctorService]
})

export class DoctorModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
   }
}