export type ISlotDays = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface IMentorSlot {
  _id?:string
  mentorId: string;
  courseId: string;
  selectedDays: ISlotDays[];
  slotDuration: number;
  startTime: string;
  endTime: string;
  isActive?: boolean;
  pricePerSlot?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
