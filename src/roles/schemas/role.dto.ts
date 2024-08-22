import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RoleDto {
  @ApiPropertyOptional({
    type: String,
    description: 'This is required',
  })
  name: string;
  @ApiProperty({
    type: [String],
    description: 'This is required',
  })
  privileges: string[];
}