import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserDto {
  @ApiPropertyOptional({
    type: String,
    description: 'This is required',
  })
  email: string;
  @ApiProperty({
    type: String,
    description: 'This is required',
  })
  firstName: string;
  @ApiProperty({
    type: String,
    description: 'This is required',
  })
  lastName: string;
  @ApiProperty({
    type: String,
    description: 'This is required',
  })
  password: string;
  @ApiProperty({
    type: String,
    description: 'This is required',
  })
  role: string;
  @ApiProperty({
    type: String,
    description: 'This is required',
  })
  dayStart: string;
  @ApiProperty({
    type: String,
    description: 'This is required',
  })
  dayEnd: string;
  @ApiProperty({
    type: String,
    description: 'This is required',
  })
  lunchStart: string;
  @ApiProperty({
    type: String,
    description: 'This is required',
  })
  lunchEnd: string;
  @ApiProperty({
    type: Number,
    description: 'This is required',
  })
  slotDuration: number;
  @ApiProperty({
    type: String,
    description: 'This is required',
  })
  timezone: string;
}