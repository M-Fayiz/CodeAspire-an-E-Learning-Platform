import { Types } from "mongoose";

export interface IMessageDto {
  _id: Types.ObjectId;
  chatId: Types.ObjectId;
  sender: Types.ObjectId;
  content?: string;
  type: "text" | "image" | "video" | "pdf";
  status: "sent" | "delivered" | "read";
  mediaUrl?: string | null;
  createdAt: Date;
}
