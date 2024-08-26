import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user-auth/schemas/user-auth.schema';

@Schema({ timestamps: true })
export class DoctorAppointments {
  @Prop({type: Types.ObjectId, ref: 'User'})
  doctor: User;
  @Prop({type: Date})
  date: Date;
  @Prop({type: Boolean})
  isAvailable: boolean;
  @Prop({type: [String]})
  slots: string[];
}

export type DoctorAppointmentsDocument = DoctorAppointments & Document;
export const DoctorAppointmentsSchema = SchemaFactory.createForClass(DoctorAppointments);