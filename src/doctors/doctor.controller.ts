import { Controller, Post, Body, Get, UseGuards, Req, Put, Param } from '@nestjs/common';
import { AuthGuard } from '../user-auth/auth-guard';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { DoctorService } from './doctor.service';
import { DoctorDto } from './schemas/doctor.dto';
import { Doctor } from './schemas/doctor.schema';
import { DoctorAppointments } from './schemas/doctor-appointments.schema';

@ApiTags('Doctor specializations')
@Controller('')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @ApiOperation({summary: 'Create doctor specialization' })
  @ApiResponse({ status: 200, description: 'Success' })
  @Post('specialization')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async createDoctor(@Req() request: Request, @Body() body: DoctorDto): Promise<{ message: string }> {
    const message = await this.doctorService.createSpecialization(request['user']["userId"], body);
    return message;
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
  async getDoctorSpecializations(@Req() request: Request): Promise<Doctor[]> {
    console.log("request: ", request["user"]["userId"]);
    const specializations = this.doctorService.getSpecialization(request['user']["userId"]);
    return specializations;
  }

  @Get('doctor/search/:spec')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'specialization', required: true, description: 'Doctor Specialization' })
  getDoctorsBySpecialization(@Param('spec') specialization?: string): Promise<Doctor[]> {
    console.log("request: ", specialization);
    return this.doctorService.getSpecializations(specialization);
  }

  @Get('doctor/appointments/:id/:date')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'Doctor ID' })
  @ApiParam({ name: 'date', required: true, description: 'Date' })
  getDoctorAppointments(@Param('id') id?: string, @Param('date') date?: string): Promise<string[]> {
    console.log("request: ", id, date);
    return this.doctorService.getAppointments(id, date);
  }

  @Get('doctor/id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getDoctorSpecializationsById(@Req() request: Request): Promise<Doctor> {
    console.log("request: ", request["user"]["userId"]);
    const specialization = this.doctorService.getSpecializationById(request['user']["userId"]);
    return specialization;
  }
}