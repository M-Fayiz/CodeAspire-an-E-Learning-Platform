
import { Types } from "mongoose";


export interface ISessionBooking {
    learnerId:Types.ObjectId
    slotId:Types.ObjectId
    date:Date
    startTime:string
    endTime:string
    type:'free'|'paid'
    status:"booked"|"completed"
    feedback?:string
} 