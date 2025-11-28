import { Types } from "mongoose";

export interface ITransaction {
  paymentType: "COURSE_PURCHASE" | "SLOT_BOOKING";
  orderId?: Types.ObjectId;
  slotBookingId?: Types.ObjectId;
  slotId?: Types.ObjectId;
  userId: Types.ObjectId;
  mentorId: Types.ObjectId;
  courseId: Types.ObjectId;
  gatewayTransactionId: string;
  amount: number;
  paymentMethod: "stripe" | "wallet";
  adminShare: number;
  mentorShare: number;
  status: "success" | "failed" | "refunded";
  createdAt?: Date;
  updatedAt?: Date;
}
export enum IPaymentTypes{
  COURSE='COURSE_PURCHASE',
  SLOTS= "SLOT_BOOKING"

} ;
