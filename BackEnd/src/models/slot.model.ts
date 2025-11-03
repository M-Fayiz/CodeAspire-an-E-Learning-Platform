import mongoose, { Schema, Document, Types } from "mongoose";
import  { DayOfWeek, IMentorSlot } from "../types/slot.type";

export interface ISlotModel extends IMentorSlot, Document {
  _id: Types.ObjectId;
}

const SlotSchema = new mongoose.Schema<ISlotModel>(
  {
    mentorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    days: [
      {
        day: { type: String, enum: Object.values(DayOfWeek), required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
      },
    ],
    slotDuration: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    pricePerSlot: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const SlotModel = mongoose.model<ISlotModel>("Slot", SlotSchema);

