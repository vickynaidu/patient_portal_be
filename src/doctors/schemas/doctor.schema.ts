import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user-auth/schemas/user-auth.schema';

@Schema({ timestamps: true })
export class Doctor {
  @Prop({type: Types.ObjectId, ref: 'User'})
  doctor: User;
  @Prop()
  specialization: string;
  @Prop()
  start_year: number;
  
}

export type DoctorDocument = Doctor & Document;
export const DoctorSchema = SchemaFactory.createForClass(Doctor);