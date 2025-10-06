import { Types } from "mongoose";

export interface ITransaction {
  orderId: Types.ObjectId;
  userId: Types.ObjectId;
  mentorId:Types.ObjectId;
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
