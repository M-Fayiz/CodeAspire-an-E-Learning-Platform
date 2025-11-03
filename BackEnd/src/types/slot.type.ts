import { Types } from "mongoose";

export enum DayOfWeek {
  SUNDAY = "SUNDAY",
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY"
}

export interface ISlotDays {
  day: DayOfWeek;
  startTime: string;  
  endTime: string;    
}

export interface IMentorSlot {
  mentorId: Types.ObjectId;   
  courseId: Types.ObjectId;  
  days: ISlotDays[];          
  slotDuration: number;       
  isActive?: boolean;         
  pricePerSlot?: number;      
  createdAt?: Date;           
  updatedAt?: Date;
}
