import { Types } from "mongoose";
import { PaymentMethod, TransactionType } from "../const/transaction.const";

export interface ITransaction {
  paymentType:TransactionType;
  orderId?: Types.ObjectId;
  slotBookingId?: Types.ObjectId;
  slotId?: Types.ObjectId;
  userId: Types.ObjectId;
  mentorId: Types.ObjectId;
  courseId: Types.ObjectId;
  gatewayTransactionId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  adminShare: number;
  mentorShare: number;
  status: ITransactionStatus
  createdAt?: Date;
  updatedAt?: Date;
}


export enum ITransactionStatus{
  SUCCESS='success',
  FAILED='failed',
  REFUNDED='refunded',
}