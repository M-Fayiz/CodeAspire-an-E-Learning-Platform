import { Types } from "mongoose";

export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  VIDEO = "video",
  PDF = "pdf",
}

export enum MessageStatus {
  SENDING = "sending",
  SENT = "sent",
  DELIVERED = "delivered",
  READ = "read",
}

export interface IMessage {
  chatId: Types.ObjectId;
  sender: Types.ObjectId;
  content?: string;
  type: MessageType;
  status: MessageStatus;
  mediaUrl?: string | null;
  createdAt: Date;
}
