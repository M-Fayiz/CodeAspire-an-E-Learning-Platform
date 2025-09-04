import mongoose, { Types ,Document, Schema} from "mongoose";
import { IOrder } from "../types/order.type";

export interface IOrderModel extends Document<Types.ObjectId>, Omit<IOrder, "_id"> {}

const OrderSchema = new mongoose.Schema<IOrderModel>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'courses',
    },
    status: {
      type: String,
      enum: ['completed', 'failed', 'pending', 'cancelled'],
      default: 'pending',
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    paymentIntentId: {
      type: String,
    },
  },
  { timestamps: true }
);


export const OrderModel=mongoose.model<IOrderModel>('orders',OrderSchema)

