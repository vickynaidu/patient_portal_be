import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class MeetingNotes {
  @Prop()
  who: string;
  @Prop()
  notes: string;
}

export type MeetingNotesDocument = MeetingNotes & Document;
export const MeetingNotesSchema = SchemaFactory.createForClass(MeetingNotes);