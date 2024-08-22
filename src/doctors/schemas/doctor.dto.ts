import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DoctorDto {
  @ApiProperty({
    type: String,
    description: 'This is required',
  })
  doctor: string;
  @ApiProperty({
    type: String,
    description: 'This is required',
  })
  specialization: string;
  @ApiProperty({
    type: Number,
    description: 'This is required',
  })
  start_year: number;
}