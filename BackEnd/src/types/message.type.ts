import { Types } from "mongoose";

export interface IMessage {
  chatId: Types.ObjectId;
  sender: Types.ObjectId;
  content?: string;
  type: "text" | "image" | "video" | "pdf";
  status: "sending" | "sent" | "delivered" | "read";
  mediaUrl?: string | null;
  createdAt: Date;
}
