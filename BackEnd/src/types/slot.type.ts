import { Types } from "mongoose";




export interface IMentorSlot {
  mentorId: Types.ObjectId;   
  courseId: Types.ObjectId;  
  selectedDays:  "Mon"| "Tue"|"Wed"| "Thu"| "Fri"| "Sat"| "Sun"[];          
  slotDuration: number;       
  isActive?: boolean;         
  pricePerSlot?: number;   
  startTime: string;  
  endTime: string;      
  createdAt?: Date;           
  updatedAt?: Date;
}
