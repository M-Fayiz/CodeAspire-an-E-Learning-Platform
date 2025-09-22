import { Types } from "mongoose";

export interface ITransaction {
  orderId: Types.ObjectId;
  userId: Types.ObjectId;
  gatewayTransactionId: string;
  amount: number;
  paymentMethod: 'stripe'|'wallet';
  status: "success" | "failed" | "refunded";
  createdAt?: Date;
}
