export interface IBaseBookingDTO {
  slotId: string;
  date: Date | string;
  startTime: Date | string;
  endTime: Date | string;
  type?: "free" | "paid";
  status?: "booked" | "completed" | "Pending" | "canceled" | "refunded";
  feedback?: string;
  studentStatus?: "passed" | "failed" | "Pending";
}
export interface IBookingDTOforLearner extends IBaseBookingDTO {
  _id: string;
  learnerId: {
    _id: string;
    name: string;
  };
  courseId: {
    _id: string;
    title: string;
  };
  mentorId: {
    _id: string;
    name: string;
  };
}

export interface IBookingDTOforMentors extends IBookingDTOforLearner {}
