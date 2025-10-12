import mongoose ,{Schema, Document, Types } from "mongoose";
import { IMessage } from "../types/message.type";


export interface IChatModel
  extends Document<Types.ObjectId>,
    Omit<IMessage, "_id"> {}


const MessageSchema=new mongoose.Schema<IChatModel>({
     chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String },
  type: { type: String, enum: ['text', 'image', 'video', 'pdf'], default: 'text' },
  mediaUrl: { type: String }, // if file is uploaded to S3
  createdAt: { type: Date, default: Date.now }
})

export const MessageModel=mongoose.model('messages',MessageSchema)

