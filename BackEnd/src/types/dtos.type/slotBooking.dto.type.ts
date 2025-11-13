import { Types } from "mongoose";
import { ICourses } from "../courses.type";
import { ILearnerModel, IMenterModel } from "../../models/user.model";

export interface IVideoSessionDTO {
  roomId: Types.ObjectId;
  mentorId: Types.ObjectId;
  learnerId: Types.ObjectId;
}

export interface IBaseBookingDTO {
  slotId: Types.ObjectId;
  date: Date | string;
  startTime: Date | string;
  endTime: Date | string;
  type?: "free" | "paid";
  status?: "booked" | "completed" | "Pending" | "canceled" | "refunded";
  feedback?: string;
  studentStatus?: "passed" | "failed" | "Pending";
}
export interface IBookingDTOforLearner extends IBaseBookingDTO {
  _id: Types.ObjectId;

  courseId: {
    _id: Types.ObjectId;
    title: string;
  };
  mentorId: {
    _id: Types.ObjectId;
    name: string;
  };
  learnerId: {
    _id: Types.ObjectId;
    name: string;
  };
}

export interface IPopulatedBooking extends IBaseBookingDTO {
  _id: Types.ObjectId;
  learnerId: ILearnerModel;
  courseId: ICourses;
  mentorId: IMenterModel;
}
