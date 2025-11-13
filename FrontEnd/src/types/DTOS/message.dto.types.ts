export interface IMessageDto {
  _id: string;
  chatId: string;
  sender: string;
  content?: string;
  type: "text" | "image" | "video" | "pdf" | "audio";
  status: "sending" | "sent" | "delivered" | "read";
  mediaUrl?: string | null;
  createdAt: Date | string;
}
