import { Types } from "mongoose";

export interface ITransaction {
  orderId: Types.ObjectId;
  userId: Types.ObjectId;
  gatewayTransactionId: string;
  amount: number;
  paymentMethod: string;
  status: "success" | "failed" | "refunded";
  createdAt: Date;
}
