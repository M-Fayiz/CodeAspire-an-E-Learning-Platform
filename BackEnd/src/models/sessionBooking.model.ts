
import mongoose, { Types ,Schema,Document} from "mongoose";
import { ISessionBooking } from "../types/sessionBooking.type";


export interface ISessionBookingModel extends ISessionBooking , Document{
    _id:Types.ObjectId
}

const SessionBookingSchema=new mongoose.Schema<ISessionBookingModel>({
    learnerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    slotId: { type: Schema.Types.ObjectId, ref: "MentorSlot", required: true }, 
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    type: { type: String, enum: ["free", "paid"], required: true },
    status: {
      type: String,
      enum: ["booked", "completed"],
      default: "booked",
    },
    feedback: { type: String },
}, { timestamps: true })

export const SessionBookingModel=mongoose.model('sessionBooking',SessionBookingSchema)