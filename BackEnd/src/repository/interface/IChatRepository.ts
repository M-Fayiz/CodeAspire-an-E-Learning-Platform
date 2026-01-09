import { FilterQuery, Types } from "mongoose";
import { IChatModel } from "../../models/chat.model";
import { IChatPopulated } from "../../types/dtos.type/chat.dto.types";

export interface IChatRespository {
  createChat(chatData: Partial<IChatModel>): Promise<IChatModel>;
  getChat(prticipandtKey: string): Promise<IChatModel | null>;
  findChatId(chatId: Types.ObjectId): Promise<IChatModel | null>;
  updateChat(
    chatId: Types.ObjectId,
    filter: FilterQuery<IChatModel>,
  ): Promise<IChatModel | null>;
  listUsers(senderId: Types.ObjectId): Promise<IChatPopulated[] | null>;
  IncrementUnreadMsg(
    chatId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<IChatModel | null>;
  resetUnreadMsg(
    chatId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<IChatModel | null>;
}
