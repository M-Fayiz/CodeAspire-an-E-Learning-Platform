import mongoose, { Schema, Document, Types } from "mongoose";
import { IMessage } from "../types/message.type";
import { DbModelName } from "../const/modelName";

export interface IMessageModel
  extends Document<Types.ObjectId>,
    Omit<IMessage, "_id"> {}

const MessageSchema = new mongoose.Schema<IMessageModel>({
  chatId: { type: Schema.Types.ObjectId, ref: DbModelName.CHAT, required: true },
  sender: { type: Schema.Types.ObjectId, ref: DbModelName.USER, required: true },
  content: { type: String },
  type: {
    type: String,
    enum: ["text", "image", "video", "pdf"],
    default: "text",
  },
  mediaUrl: { type: String },
  status: {
    type: String,
    enum: ["sending", "sent", "delivered", "read"],
    default: "sending",
  },
  createdAt: { type: Date, default: Date.now },
});

export const MessageModel = mongoose.model<IMessageModel>(
 DbModelName.MESSAGE,
  MessageSchema,
);
