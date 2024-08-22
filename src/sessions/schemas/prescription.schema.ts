import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Prescription {
  @Prop()
  medicine: string;
  @Prop()
  type: string;
  @Prop()
  before_meal: boolean;
}

export type PrescriptionDocument = Prescription & Document;
export const PrescriptionSchema = SchemaFactory.createForClass(Prescription);