import { Types } from "mongoose";

export interface IChat {
  users: Types.ObjectId[];
  participantKey: string;
  latestMessage?: string;
  lastMessageTime: Date;
  unreadCount: Map<string, number>;
  createdAt?: Date;
}
