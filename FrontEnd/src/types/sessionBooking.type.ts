export interface ISessionBooking {
  mentorId: string;
  learnerId: string;
  courseId: string;
  slotId: string;
  date: Date | string;
  startTime: string;
  endTime: string;
  type?: "free" | "paid";
  status?: "booked" | "completed" | "Pending";
  feedback?: string;
}
