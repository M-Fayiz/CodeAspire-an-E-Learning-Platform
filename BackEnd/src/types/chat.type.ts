import { Types } from "mongoose";

export interface IChat {
  users: Types.ObjectId[];
  participantKey: string;
  latestMessage?: Types.ObjectId | null;
  lastMessageTime: Date;
  createdAt?: Date;
}
