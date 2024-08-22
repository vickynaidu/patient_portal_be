import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiPropertyOptional({
    type: String,
    description: 'This is required',
  })
  email: string;
  @ApiProperty({
    type: String,
    description: 'This is required',
  })
  password: string;
}