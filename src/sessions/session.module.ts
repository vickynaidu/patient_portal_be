import { Module, NestModule, MiddlewareConsumer, forwardRef } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from './schemas/session.schema';
import { Prescription, PrescriptionSchema } from './schemas/prescription.schema';
import { MeetingNotes, MeetingNotesSchema } from './schemas/meeting_notes.schema';
import { JwtModule } from '@nestjs/jwt';
import { secretKey } from 'src/user-auth/config';
import { UserAuthModule } from 'src/user-auth/user-auth.module';
import { DoctorModule } from 'src/doctors/doctor.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Session.name, schema: SessionSchema },
      { name: Prescription.name, schema: PrescriptionSchema },
      { name: MeetingNotes.name, schema: MeetingNotesSchema },
    ]),
    JwtModule.register({
      secret: secretKey.secret,
      signOptions: { expiresIn: '1h' }, 
    }),
    DoctorModule,
    forwardRef(() => UserAuthModule),
  ],
  controllers: [SessionController],
  providers: [SessionService]
})

export class SessionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
   }
}