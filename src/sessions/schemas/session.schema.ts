import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MeetingNotes } from './meeting_notes.schema';
import { Prescription } from './prescription.schema';
import { User } from 'src/user-auth/schemas/user-auth.schema';
import { Doctor } from 'src/doctors/schemas/doctor.schema';

@Schema({ timestamps: true })
export class Session {
  @Prop({type: Types.ObjectId, ref: 'User'})
  session_for: User;
  @Prop()
  session_date: Date;
  @Prop()
  session_time: string;
  @Prop({type: Types.ObjectId, ref: 'Doctor'})
  session_with: Doctor;
  @Prop()
  meeting_notes: [MeetingNotes];
  @Prop()
  prescription: [Prescription];
  @Prop()
  is_completed: boolean;
}

export type UserDocument = Session & Document;
export const SessionSchema = SchemaFactory.createForClass(Session);