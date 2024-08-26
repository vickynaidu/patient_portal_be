import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { secret } from 'src/user-auth/config';
import { UserAuthModule } from 'src/user-auth/user-auth.module';
import { Doctor, DoctorSchema } from './schemas/doctor.schema';
import { DoctorService } from './doctor.service';
import { DoctorAppointments, DoctorAppointmentsSchema } from './schemas/doctor-appointments.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Doctor.name, schema: DoctorSchema },
      { name: DoctorAppointments.name, schema: DoctorAppointmentsSchema },
    ]),
    JwtModule.register({
      secret: secret.secret,
      signOptions: { expiresIn: secret.authTokenExp }, 
    }),
    UserAuthModule
  ],
  controllers: [DoctorController],
  providers: [DoctorService],
  exports: [DoctorService],
})

export class DoctorModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
   }
}