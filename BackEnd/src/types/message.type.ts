import { Types } from "mongoose";


export interface IMessage{
    chatId:Types.ObjectId
    sender:Types.ObjectId
    content:string
    type:'text'| 'image'|'video'| 'pdf'
    status:'sent'|'delivered'|'read'
    mediaUrl:string
    createdAt:Date
}