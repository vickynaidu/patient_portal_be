import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PrescriptionDto {
  @ApiPropertyOptional({
    type: String,
    description: 'This is required',
  })
  medicine: string;
  @ApiProperty({
    type: String,
    description: 'This is required',
  })
  type: string;
  @ApiProperty({
    type: String,
    description: 'This is required',
  })
  before_meal: boolean;
}