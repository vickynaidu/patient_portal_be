import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from 'src/roles/schemas/role.schema';

@Schema({ timestamps: true })
export class User {
  @Prop()
  email: string;
  @Prop()
  password: string;
  @Prop()
  firstName: string;
  @Prop()
  lastName: string;
  @Prop({type: Types.ObjectId, ref: 'Role'})
  role: Role;
  @Prop()
  dayStart: string;
  @Prop()
  dayEnd: string;
  @Prop()
  lunchStart: string;
  @Prop()
  lunchEnd: string;
  @Prop()
  slotDuration: number;
  @Prop()
  timezone: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);