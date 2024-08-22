import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from './schemas/session.schema';
import { SessionDto } from './schemas/session.dto';
import { MeetingNotes } from './schemas/meeting_notes.schema';
import { Prescription } from './schemas/prescription.schema';
import { UserAuthService } from 'src/user-auth/user-auth.service';


@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    @InjectModel(Session.name) private sessionModel: Model<Session>,
    @InjectModel(MeetingNotes.name) private meetingNotesModel: Model<MeetingNotes>,
    @InjectModel(Prescription.name) private prescriptionModel: Model<Prescription>,
    @Inject(UserAuthService) private readonly userService: UserAuthService
  ) { }

  async createSession(data: SessionDto): Promise<{ message: string }> {
    try {
      console.log("Session: ", data);
      const {session_for, session_time, session_with, meeting_notes, prescription, status} = data;
      const withUserObject = await this.userService.getUserProfile(session_with);
      const forUserObject = await this.userService.getUserProfile(session_for);
      await this.sessionModel.create({session_for: withUserObject, session_time, session_with: forUserObject, meeting_notes, prescription, status});
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
      const sessions = await this.sessionModel.find({ _id }).sort({"session_time": 'desc'}).select('session_time session_with is_completed _id');
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