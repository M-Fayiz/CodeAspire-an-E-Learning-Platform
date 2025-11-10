import mongoose, { Types, Schema, Document } from "mongoose";
import { ISlotBooking } from "../types/sessionBooking.type";

export interface ISlotBookingModel extends ISlotBooking, Document {
  _id: Types.ObjectId;
}

const SessionBookingSchema = new mongoose.Schema<ISlotBookingModel>(
  {
    learnerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "courses", required: true },
    slotId: { type: Schema.Types.ObjectId, ref: "MentorSlot", required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    type: { type: String, enum: ["free", "paid"], required: true },
    status: {
      type: String,
      enum: ["booked", "completed", "Pending"],
      default: "booked",
    },
    feedback: { type: String },
  },
  { timestamps: true },
);

export const SlotBookingModel = mongoose.model(
  "sessionBooking",
  SessionBookingSchema,
);
