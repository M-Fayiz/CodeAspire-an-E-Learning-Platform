import mongoose, { Schema, Document, Types } from "mongoose";
import { IChat } from "../types/chat.type";
import { DbModelName } from "../const/modelName.const";

export interface IChatModel extends IChat, Document<Types.ObjectId> {}

const ChatSchema = new mongoose.Schema<IChatModel>({
  users: [
    { type: Schema.Types.ObjectId, ref: DbModelName.USER, required: true },
  ],
  participantKey: { type: String, unique: true },
  latestMessage: { type: String },
  lastMessageTime: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export const ChatModel = mongoose.model<IChatModel>(
  DbModelName.CHAT,
  ChatSchema,
);
