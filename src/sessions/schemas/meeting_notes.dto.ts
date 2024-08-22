import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MeetingNotesDto {
  @ApiPropertyOptional({
    type: String,
    description: 'This is required',
  })
  who: string;
  @ApiProperty({
    type: String,
    description: 'This is required',
  })
  notes: string;
}