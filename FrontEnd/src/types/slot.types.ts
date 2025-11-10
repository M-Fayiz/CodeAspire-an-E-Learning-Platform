export type slotDays="Mon"| "Tue"|"Wed"| "Thu"| "Fri"| "Sat"| "Sun"


export interface IBaseSlot {
  selectedDays: slotDays[];
  slotDuration: number;
  isActive?: boolean;
  pricePerSlot?: number;
  startTime: string;
  endTime: string;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface  IMentorSlot  extends IBaseSlot{
  _id?:string
  mentorId: string;   
  courseId: string;  
}
