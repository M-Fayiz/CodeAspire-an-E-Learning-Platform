import mongoose, { Types, Document, Schema } from "mongoose";
import { ITransaction } from "../types/transaction.type";
import { DbModelName } from "../const/modelName";

export interface ITransactionModel
  extends Document<Types.ObjectId>,
    Omit<ITransaction, "_id"> {}

const TransactionSchema = new mongoose.Schema<ITransactionModel>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: DbModelName.ORDER,
    },
    slotId: {
      type: Schema.Types.ObjectId,
      ref: DbModelName.SLOT,
    },
    slotBookingId: {
      type: Schema.Types.ObjectId,
      ref: DbModelName.SLOT_BOOKING,
    },
    paymentType: {
      type: String,
      enum: ["COURSE_PURCHASE", "SLOT_BOOKING"],
      required: true,
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
      ref: DbModelName.USER,
    },
    mentorId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: DbModelName.USER,
    },
    gatewayTransactionId: {
      type: String,
    },
    paymentMethod: {
      enum: ["stripe", "wallet"],
    },
    courseId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: DbModelName.COURSE,
    },
    adminShare: { type: Number, required: true },
    mentorShare: { type: Number, required: true },
  },
  { timestamps: true },
);

export const transactionModel = mongoose.model<ITransactionModel>(
  DbModelName.TRANSACTION,
  TransactionSchema,
);
