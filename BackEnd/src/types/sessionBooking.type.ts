import { Types } from "mongoose";

export enum bookingType {
  FREE = "free",
  PAID = "paid",
}

export enum BookingStatus {
  BOOKED = "booked",
  COMPLETED = "completed",
  PENDING = "Pending",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

export enum StudenStatus {
  PASSED = "passed",
  FAILED = "failed",
  PENDING = "Pending",
}

export interface ISlotBooking {
  learnerId: Types.ObjectId;
  courseId: Types.ObjectId;
  slotId: Types.ObjectId;
  date: Date | string;
  startTime: Date | string;
  endTime: Date | string;
  type?: bookingType;
  status?: BookingStatus;
  feedback?: string;
  studentStatus?: StudenStatus;
  mentorId: Types.ObjectId;
}
