

import type { ICourseData } from "./courseForm.type";

export type Days =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type SlotDay = {
  startTime: string;
  endTime: string;
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
  _id?: string;
  mentorId: string;
  courseId: string;
}

export interface mentorPopulatedSlots extends IBaseSlot {
  _id: string;
  mentorId: string;
  courseId: ICourseData;
}
