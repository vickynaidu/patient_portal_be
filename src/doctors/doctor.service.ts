import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor } from './schemas/doctor.schema';
import { DoctorDto } from './schemas/doctor.dto';
import { UserAuthService } from 'src/user-auth/user-auth.service';


@Injectable()
export class DoctorService {
  private readonly logger = new Logger(DoctorService.name);

  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
    @Inject(UserAuthService) private readonly userService: UserAuthService
  ) { }

  async createSpecialization(data: DoctorDto): Promise<{ message: string }> {
    try {
      console.log("Specialization: ", data);
      const {doctor, specialization} = data;
      const doctorObj = await this.userService.getUserProfile(doctor);
      await this.doctorModel.create({doctor: doctorObj, specialization});
      return { message: 'Doctor specialization added successfully' };
    } catch (error) {
      console.log("Error: ", error);
      throw new Error('An error occurred while creating doctor');
    }
  }

  async updateSpecialization(data: DoctorDto): Promise<{ message: string }> {
    try {
      await this.doctorModel.updateOne(data);
      return { message: 'Specialization updated successfully' };
    } catch (error) {
      console.log("Error: ", error);
      throw new Error('An error occurred while updating doctor');
    }
  }


  async getSpecializations(specialization): Promise<Doctor[]> {
    try {
      const doctor = await this.doctorModel.find({ _id: specialization });
      return doctor;
    } catch (error) {
      this.logger.error(`An error occurred while retrieving doctor: ${error.message}`);
      throw new Error('An error occurred while retrieving doctor');
    }
  }
  async getSpecialization(_id): Promise<Doctor> {
    try {
      const doctor = await this.doctorModel.findOne({ _id });
      console.log("Specialization obj of ", _id, doctor);
      return doctor;
    } catch (error) {
      this.logger.error(`An error occurred while retrieving doctor: ${error.message}`);
      throw new Error('An error occurred while retrieving doctor');
    }
  }
}