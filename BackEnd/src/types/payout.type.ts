import { Types } from "mongoose";

export interface IPayout{
    _id:Types.ObjectId,
    transactionId: Types.ObjectId,
    recipientType: "mentor"|"admin",
    recipientId:Types.ObjectId,
    amount: number,
    percentage: number,
}