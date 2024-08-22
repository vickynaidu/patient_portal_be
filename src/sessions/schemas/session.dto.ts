import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MeetingNotesDto } from './meeting_notes.dto';
import { PrescriptionDto } from './prescription.dto';

export class SessionDto {
  @ApiProperty({
    type: String,
    description: 'This is required',
  })
  session_for: string;
  @ApiPropertyOptional({
    type: Date,
    description: 'This is required',
  })
  session_time: Date;
  @ApiProperty({
    type: String,
    description: 'This is required',
  })
  session_with: string;
  @ApiProperty({
    type: [MeetingNotesDto],
    description: 'This is required',
  })
  meeting_notes: [MeetingNotesDto];
  @ApiProperty({
    type: [PrescriptionDto],
    description: 'This is required',
  })
  prescription: [PrescriptionDto];
  @ApiProperty({
    type: String,
    description: 'This is required',
  })
  status: string;
}