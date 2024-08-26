import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Session } from './schemas/session.schema';
import { SessionDto } from './schemas/session.dto';
import { MeetingNotes } from './schemas/meeting_notes.schema';
import { Prescription } from './schemas/prescription.schema';
import { UserAuthService } from 'src/user-auth/user-auth.service';
import { DoctorService } from 'src/doctors/doctor.service';
import * as moment from 'moment-timezone';


@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    @InjectModel(Session.name) private sessionModel: Model<Session>,
    @InjectModel(MeetingNotes.name) private meetingNotesModel: Model<MeetingNotes>,
    @InjectModel(Prescription.name) private prescriptionModel: Model<Prescription>,
    @Inject(UserAuthService) private readonly userService: UserAuthService,
    @Inject(DoctorService) private readonly doctorService: DoctorService
  ) { }

  async createSession(data: SessionDto, _id: string): Promise<{ message: string }> {
    try {
      console.log("Session: ", data);
      const {session_date, session_time, session_with, meeting_notes, prescription, is_completed} = data;
      const withUserObject = await this.doctorService.getSpecializationById(session_with);
      const forUserObject = await this.userService.getUserProfile(_id);
      const appDate = moment(session_date).format("YYYY-MM-DD");
      await this.sessionModel.create({session_for: forUserObject, session_date: appDate, session_time, session_with: withUserObject, meeting_notes, prescription, is_completed});
      console.log("Doctor Service: ", withUserObject, session_time);
      await this.doctorService.createDoctorAppointment(withUserObject.doctor, session_date);
      return { message: 'Session created successfully' };
    } catch (error) {
      console.log("Error: ", error);
      throw new Error('An error occurred while creating session');
    }
  }

  async updateSession(data: SessionDto): Promise<{ message: string }> {
    try {
      console.log("Session: ", data);
      await this.sessionModel.updateOne(data);
      return { message: 'Session updated successfully' };
    } catch (error) {
      console.log("Error: ", error);
      throw new Error('An error occurred while updating session');
    }
  }


  async getSessions(_id): Promise<Session[]> {
    try {
      const user = await this.userService.getUserProfile(_id);
      const ObjectId = Types.ObjectId;
      let sessions = [];
      if(user.role.name === 'User')
        sessions = await this.sessionModel.find({ session_for: new ObjectId(_id) }).sort({"session_time": 'desc'}).populate({path: "session_with", populate: {path: "doctor", select: "firstName lastName"}});
      else {
        const specializations = await this.doctorService.getSpecialization(_id);
        console.log("Doctor object: ", specializations);
        const doctorsArray = [];
        specializations.forEach(spec => {
          doctorsArray.push(new ObjectId(spec["_id"]));
        });
        console.log("Doctors array: ", doctorsArray);
        sessions = await this.sessionModel.find({session_with: { $in: doctorsArray}}).sort({"session_time": 'desc'}).populate({path: "session_with", populate: {path: "doctor", select: "firstName lastName"}});
      }
      console.log("Available sessions: ", sessions);
      return sessions;
    } catch (error) {
      this.logger.error(`An error occurred while retrieving sessions: ${error.message}`);
      throw new Error('An error occurred while retrieving sessions');
    }
  }
  async getSession(_id): Promise<Session> {
    try {
      const session = await this.sessionModel.findOne({ _id });
      console.log("Session obj of ", _id, session);
      return session;
    } catch (error) {
      this.logger.error(`An error occurred while retrieving session: ${error.message}`);
      throw new Error('An error occurred while retrieving session');
    }
  }
}