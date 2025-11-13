import { Types } from "mongoose";

export type Days =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type SlotDay = {
  startTime: Date | string;
  endTime: Date | string;
  day: Days;
  active: boolean;
};

export interface IBaseSlot {
  selectedDays: SlotDay[];
  slotDuration: number;
  isActive?: boolean;
  pricePerSlot?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMentorSlot extends IBaseSlot {
  mentorId: Types.ObjectId;
  courseId: Types.ObjectId;
}
