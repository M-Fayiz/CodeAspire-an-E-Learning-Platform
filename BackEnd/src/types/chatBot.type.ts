import { Types } from "mongoose";

export interface IChatBot{
    userId:Types.ObjectId,
    courseId:Types.ObjectId
    messages:IBotMessage[]
}
export enum Sender{
    USER='user',
    AI='ai'
}
export interface IBotMessage{
    sender:Sender,
    content:string,
    createdAt:Date
}