export interface IMessageDto {
  _id: string;
  chatId: string;
  sender: string;
  content?: string;
  type: "text" | "image" | "video" | "pdf";
  status: "sending" | "sent" | "delivered" | "read";
  mediaUrl?: string | null;
  createdAt: Date | string;
}
