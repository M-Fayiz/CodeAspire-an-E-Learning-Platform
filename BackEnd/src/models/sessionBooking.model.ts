import mongoose, { Types, Schema, Document } from "mongoose";
import { ISlotBooking } from "../types/sessionBooking.type";
import { DbModelName } from "../const/modelName";

export interface ISlotBookingModel extends ISlotBooking, Document {
  _id: Types.ObjectId;
}

const SessionBookingSchema = new mongoose.Schema<ISlotBookingModel>(
  {
    learnerId: {
      type: Schema.Types.ObjectId,
      ref: DbModelName.USER,
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: DbModelName.COURSE,
      required: true,
    },
    slotId: {
      type: Schema.Types.ObjectId,
      ref: DbModelName.SLOT,
      required: true,
    },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    type: { type: String, enum: ["free", "paid"], required: true },
    status: {
      type: String,
      enum: ["booked", "completed", "Pending", "canceled", "refunded"],
      default: "Pending",
    },
    studentStatus: {
      type: String,
      enum: ["passed", "failed", "Pending"],
      default: "Pending",
    },
    feedback: { type: String },
    mentorId: {
      type: Schema.Types.ObjectId,
      ref: DbModelName.USER,
      required: true,
    },
  },
  { timestamps: true },
);

export const SlotBookingModel = mongoose.model(
  DbModelName.SLOT_BOOKING,
  SessionBookingSchema,
);
