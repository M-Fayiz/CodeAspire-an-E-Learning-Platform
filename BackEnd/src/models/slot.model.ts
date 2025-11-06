import mongoose, { Schema, Document, Types } from "mongoose";
import  {  IMentorSlot } from "../types/slot.type";

export interface ISlotModel extends IMentorSlot, Document {
  _id: Types.ObjectId;
}

const SlotSchema = new mongoose.Schema<ISlotModel>(
  {
    mentorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    selectedDays: {
      type: [String],
      enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      required: true,
    },
    slotDuration: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    pricePerSlot: { type: Number, default: 0 },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { timestamps: true }
);

export const SlotModel = mongoose.model<ISlotModel>("Slot", SlotSchema);

