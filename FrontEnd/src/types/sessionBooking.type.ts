
export type studentStatus='pending'|'passed'|'failed'
export type slotStatus="booked" | "completed" | "Pending";
export interface ISessionBooking {
  mentorId: string;
  learnerId: string;
  courseId: string;
  slotId: string;
  date: Date | string;
  startTime: string;
  endTime: string;
  type?: "free" | "paid";
  status?: slotStatus
  studentStatus:studentStatus
  feedback?: string;
}
