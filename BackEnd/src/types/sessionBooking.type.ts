import { Types } from "mongoose";

export interface ISlotBooking {
  learnerId: Types.ObjectId;
  courseId: Types.ObjectId;
  slotId: Types.ObjectId;
  date: Date | string;
  startTime: Date | string;
  endTime: Date | string;
  type?: "free" | "paid";
  status?: "booked" | "completed" | "Pending";
  feedback?: string;
}
