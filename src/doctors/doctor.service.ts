import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Doctor } from './schemas/doctor.schema';
import { DoctorDto } from './schemas/doctor.dto';
import { UserAuthService } from 'src/user-auth/user-auth.service';
import { DoctorAppointments } from './schemas/doctor-appointments.schema';
import { DoctorAppointmentsDto } from './schemas/doctor-appointments.dto';
import { UserDto } from 'src/user-auth/schemas/user-auth.dto';
import { User } from 'src/user-auth/schemas/user-auth.schema';
import * as moment from 'moment-timezone';


@Injectable()
export class DoctorService {
  private readonly logger = new Logger(DoctorService.name);

  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
    @InjectModel(DoctorAppointments.name) private doctorAppointmentsModel: Model<DoctorAppointments>,
    @Inject(UserAuthService) private readonly userService: UserAuthService
  ) { }

  async createSpecialization(doctor, data: DoctorDto): Promise<{ message: string }> {
    try {
      const { specialization, start_year } = data;
      console.log("Specialization: ", specialization, start_year);
      const doctorObj = await this.userService.getUserProfile(doctor);
      await this.doctorModel.create({ doctor: doctorObj, specialization, start_year });
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

  generateTimeSlots = (
    startDate: Date,
    endDate: Date,
    interval: number,
    bookedSlots: Date[],
    timezone:string
  ): string[] => {
    console.log(startDate, endDate, interval, bookedSlots, timezone);
    const slots: string[] = [];
    let currentSlot = new Date(startDate);
    //console.log("currentSlot: ", currentSlot);
    while (currentSlot < endDate) {
      console.log("currentSlot: ", currentSlot, bookedSlots);
      // Check if the currentSlot is in the bookedSlots list
      const isBooked = bookedSlots.some(
        (bookedSlot) => bookedSlot.getTime() === currentSlot.getTime()
      );
      if (!isBooked) {
        const userTime = moment.tz(currentSlot, timezone).format("MM/DD/YYYY HH:mm");
        slots.push(userTime);
      }
      currentSlot.setMinutes(currentSlot.getMinutes() + interval);
    }
    console.log("slots: ", slots);
    return slots;
  };

  getAvailableSlots(doctor, slots, date) {
    let bookedSlots: Date[] = [];
    const dayStartSplit = doctor.dayStart.split(":");
    const dayEndSplit = doctor.dayEnd.split(":");
    const lunchStartSplit = doctor.lunchStart.split(":");
    const lunchEndSplit = doctor.lunchEnd.split(":");
    let dayStart = new Date(date);
    dayStart.setHours(parseInt(dayStartSplit[0]));
    dayStart.setMinutes(parseInt(dayStartSplit[1]));
    dayStart.setSeconds(0);
    dayStart.setMilliseconds(0);
    let lunchStart = new Date(date);
    lunchStart.setHours(parseInt(lunchStartSplit[0]));
    lunchStart.setMinutes(parseInt(lunchStartSplit[1]));
    lunchStart.setSeconds(0);
    lunchStart.setMilliseconds(0);
    let lunchEnd = new Date(date);
    lunchEnd.setHours(parseInt(lunchEndSplit[0]));
    lunchEnd.setMinutes(parseInt(lunchEndSplit[1]));
    lunchEnd.setSeconds(0);
    lunchEnd.setMilliseconds(0);
    let dayEnd = new Date(date);
    dayEnd.setHours(parseInt(dayEndSplit[0]));
    dayEnd.setMinutes(parseInt(dayEndSplit[1]));
    dayEnd.setSeconds(0);
    dayEnd.setMilliseconds(0);
    bookedSlots = slots.map(slot => {
      const slotDate = new Date(date);
      slotDate.setHours(parseInt(slot.split(":")[0]));
      slotDate.setMinutes(parseInt(slot.split(":")[1]));
      slotDate.setSeconds(0);
      slotDate.setMilliseconds(0);
      return slotDate;
    });
    const lunchBeforeSlots = this.generateTimeSlots(dayStart, lunchStart, doctor.slotDuration, bookedSlots, doctor.timezone);
    const lunchAfterSlots = this.generateTimeSlots(lunchEnd, dayEnd, doctor.slotDuration, bookedSlots, doctor.timezone);
    console.log(doctor._id, date, " doctor appointments: ", [...lunchBeforeSlots, ...lunchAfterSlots]);
    return [...lunchBeforeSlots, ...lunchAfterSlots];
  }

  async getAppointments(_id, date): Promise<string[]> {
    try {
      console.log("getAppointments with: ", _id, date);
      const ObjectId = Types.ObjectId;
      const appts = await this.doctorAppointmentsModel.findOne({ doctor: new ObjectId(_id), date }).populate("doctor");
      console.log("getAppointments of doctor: ", appts);
      if (appts && !appts.isAvailable) {
        return [];
      }
      let doctor = appts
        ? appts.doctor
        : await this.userService.getUserProfile(_id);
      return this.getAvailableSlots(doctor, appts ? appts.slots : [], date);
    } catch (error) {
      this.logger.error(`An error occurred while retrieving doctor: ${error}`);
      throw new Error('An error occurred while retrieving doctor');
    }
  }

  async getSpecializations(specialization): Promise<Doctor[]> {
    try {
      const doctors = await this.doctorModel.find({ specialization }).populate("doctor");
      console.log(specialization, " doctors are: ", doctors);
      return doctors;
    } catch (error) {
      this.logger.error(`An error occurred while retrieving doctor: ${error.message}`);
      throw new Error('An error occurred while retrieving doctor');
    }
  }

  async getSpecialization(doctorId): Promise<Doctor[]> {
    try {
      // const doctorObj = await this.userService.getUserProfile(_id);
      // console.log("doctorObj: ", doctorObj);
      const ObjectId = Types.ObjectId;
      const specializations = await this.doctorModel.find({ doctor: new ObjectId(doctorId) });
      console.log("Specialization obj of ", doctorId, specializations);
      return specializations;
    } catch (error) {
      this.logger.error(`An error occurred while retrieving doctor: ${error.message}`);
      throw new Error('An error occurred while retrieving doctor');
    }
  }

  async getSpecializationById(_id): Promise<Doctor> {
    try {
      const specialization = await this.doctorModel.findOne({ _id }).populate("doctor");
      console.log("Specialization obj of ", _id, specialization);
      return specialization;
    } catch (error) {
      this.logger.error(`An error occurred while retrieving doctor: ${error.message}`);
      throw new Error('An error occurred while retrieving doctor');
    }
  }

  async createDoctorAppointment(doctor, date: Date): Promise<{ message: string }> {
    try {
      console.log("createDoctorAppointment: ", doctor, date);
      const ObjectId = Types.ObjectId;
      const appDate = moment(date).format("YYYY-MM-DD");
      const slot = `${new Date(date).getHours()}:${new Date(date).getMinutes()}`;
      const appts = await this.doctorAppointmentsModel.findOne({ doctor: new ObjectId(doctor._id), date: appDate }).populate("doctor");
      if(appts) {
        appts.slots.push(slot);
        appts.save();
      } else {
        const docAppt = await this.doctorAppointmentsModel.create({
          doctor: doctor._id,
          date: appDate,
          isAvailable: true,
          slots: [slot]
        });
        console.log("Doctor appointment created: ", docAppt);
      }
      return { message: 'Doctor appointment added successfully' };
    } catch (error) {
      console.log("Error: ", error);
      throw new Error('An error occurred while creating doctor');
    }
  }
}