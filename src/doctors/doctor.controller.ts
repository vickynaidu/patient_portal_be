import { Controller, Post, Body, Get, UseGuards, Req, Put, Param } from '@nestjs/common';
import { AuthGuard } from '../user-auth/auth-guard';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { DoctorService } from './doctor.service';
import { DoctorDto } from './schemas/doctor.dto';
import { Doctor } from './schemas/doctor.schema';

@ApiTags('Doctor specializations')
@Controller('')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @ApiOperation({summary: 'Create doctor specialization' })
  @ApiResponse({ status: 200, description: 'Success' })
  @Post('specialization')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async createDoctor(@Body() body: DoctorDto): Promise<{ message: string }> {
    console.log("Body: ", body);
    await this.doctorService.createSpecialization(body);
    return { message: 'User registered successfully' };
  }

  @Put('specialization')
  @ApiOperation({summary: 'Update doctor specialization' })
  @ApiResponse({ status: 200, description: 'Success' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async updateDoctor(@Body() body: DoctorDto): Promise<{ message: string }> {
    const message = await this.doctorService.updateSpecialization(body);
    return message;
  }

  @Get('doctor')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getDoctorSpecializations(@Req() request: Request): Promise<Doctor> {
    console.log("request: ", request["user"]["userId"]);
    const doctors = this.doctorService.getSpecialization(request['user']["userId"]);
    return doctors;
  }

  @Get('doctor/search')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'specialization', required: true, description: 'Doctor Specialization' })
  getDoctorsBySpecialization(@Param('id') specialization?: string[]): Promise<Doctor[]> {
    console.log("request: ", specialization);
    return this.doctorService.getSpecializations(specialization);
  }
}