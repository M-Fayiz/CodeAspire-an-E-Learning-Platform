import mongoose, { Schema, Document, Types } from "mongoose";
import { IBaseSlot } from "../types/slot.type";
import { DbModelName } from "../const/modelName.const";

export interface ISlotModel extends IBaseSlot, Document {
  _id: Types.ObjectId;
  mentorId: Types.ObjectId;
  courseId: Types.ObjectId;
}

const SlotDaySchema = new Schema(
  {
    startTime: { type: String },
    endTime: { type: String },
    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
    },
    active: { type: Boolean, default: true },
  },
  { _id: false },
);

const SlotSchema = new Schema<ISlotModel>(
  {
    mentorId: {
      type: Schema.Types.ObjectId,
      ref: DbModelName.USER,
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: DbModelName.COURSE,
      required: true,
    },
    selectedDays: {
      type: [SlotDaySchema],
      required: true,
    },
    slotDuration: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    pricePerSlot: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const SlotModel = mongoose.model<ISlotModel>(
  DbModelName.SLOT,
  SlotSchema,
);
