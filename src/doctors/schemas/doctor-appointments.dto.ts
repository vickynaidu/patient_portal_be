import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserDto } from 'src/user-auth/schemas/user-auth.dto';

export class DoctorAppointmentsDto {
  @ApiProperty({
    type: UserDto,
    description: 'This is required',
  })
  doctor: UserDto;
  @ApiProperty({
    type: Date,
    description: 'This is required',
  })
  date: Date;
  @ApiProperty({
    type: Boolean,
    description: 'This is required',
  })
  isAvailable: boolean;
  @ApiProperty({
    type: [String],
    description: 'This is required',
  })
  slots: [string];
}