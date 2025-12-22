import mongoose, { Types, Document, Schema } from "mongoose";
import { IOrder } from "../types/order.type";
import { DbModelName } from "../const/modelName.const";

export interface IOrderModel
  extends Document<Types.ObjectId>,
    Omit<IOrder, "_id"> {}

const OrderSchema = new mongoose.Schema<IOrderModel>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: DbModelName.COURSE,
    },
    status: {
      type: String,
      enum: ["completed", "failed", "pending", "cancelled"],
      default: "pending",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: DbModelName.USER,
    },
    paymentIntentId: {
      type: String,
    },
  },
  { timestamps: true },
);

export const OrderModel = mongoose.model<IOrderModel>(
  DbModelName.ORDER,
  OrderSchema,
);
