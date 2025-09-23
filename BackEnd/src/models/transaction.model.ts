import mongoose, { Types, Document, Schema } from "mongoose";
import { ITransaction } from "../types/transaction.type";

export interface ITransaactionModel
  extends Document<Types.ObjectId>,
    Omit<ITransaction, "_id"> {}

const TransactionSchema = new mongoose.Schema<ITransaactionModel>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "orders",
    },
    status: {
      type: String,
      enum: ["success", "failed", "refunded"],
    },
    amount: {
      type: Number,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    gatewayTransactionId: {
      type: String,
    },
    paymentMethod: {
      enum: ["stripe", "wallet"],
    },
  },
  { timestamps: true },
);

export const transactionModel = mongoose.model<ITransaactionModel>(
  "transactions",
  TransactionSchema,
);
