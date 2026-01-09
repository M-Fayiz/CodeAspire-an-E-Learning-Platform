import { FilterQuery, Types } from "mongoose";
import { IChatDTO, IChatListDTO } from "../../types/dtos.type/chat.dto.types";
import { IMessageDto } from "../../types/dtos.type/message.dto.type";
import { IMessage } from "../../types/message.type";
import { IChat } from "../../types/chat.type";

export interface IChatService {
  getOrCreateRoom(senderId: string, receiverId: string): Promise<IChatDTO>;
  findChat(chatId: string): Promise<IChatDTO>;
  createMessage(data: Partial<IMessage>): Promise<IMessageDto>;
  updateChat(
    chatId: Types.ObjectId,
    filter: FilterQuery<IChat>,
  ): Promise<IChatDTO>;
  updateMessage(
    messageId: string,
    filter: FilterQuery<IMessage>,
  ): Promise<IMessageDto>;
  listUsers(senderId: string): Promise<IChatListDTO[]>;
  getMessages(chatId: string, limit: number): Promise<IMessageDto[]>;
  readMessages(messageIds: string[]): Promise<IMessageDto[]>;
  incrementUnreadMSG(chatId: Types.ObjectId, userId: string): Promise<IChatDTO>;
  resetUnreadMsg(chatId: string, userId: string): Promise<IChatDTO>;
}
