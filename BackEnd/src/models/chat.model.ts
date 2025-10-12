import mongoose, {Schema, Document, Types } from "mongoose";
import { IChat } from "../types/chat.type";


export interface IChatModel
  extends Document<Types.ObjectId>,
    Omit<IChat, "_id"> {}

    const ChatSchema=new mongoose.Schema<IChatModel>({
        users: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  participantKey: { type: String, unique: true },
  latestMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
  createdAt: { type: Date, default: Date.now }
    })

export const ChatModel=mongoose.model<IChatModel>('chats',ChatSchema)