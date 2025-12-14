import { Types } from "mongoose";
import { IUser } from "../user.types";

export interface IBaseChatDTO {
  _id: Types.ObjectId;
  participantKey: string;
  latestMessage: string | null;
  lastMessageTime: Date|null;
  createdAt?: Date;
}

export interface IChatDTO extends IBaseChatDTO {
  users: Types.ObjectId[];
}

export interface IChatListDTO extends IBaseChatDTO {
  user: {
    _id: Types.ObjectId;
    name: string;
    profile: string;
  };
}

export interface IChatPopulated extends IBaseChatDTO {
  users: IUser[];
}
