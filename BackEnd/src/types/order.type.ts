import { Types } from "mongoose";

export interface IOrder {
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  totalAmount: number;
  status: "completed" | "failed" | "pending" | "cancelled";
  paymentIntentId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
