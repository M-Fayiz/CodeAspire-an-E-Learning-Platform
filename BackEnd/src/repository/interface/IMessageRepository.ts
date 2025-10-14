import { FilterQuery, Types } from "mongoose";
import { IMessageModel } from "../../models/message.model";
import { IMessage } from "../../types/message.type";

export interface IMessageRepository {
  createMessage(data: Partial<IMessage>): Promise<IMessageModel>;
  updateMessage(
    messageId: Types.ObjectId,
    filter: FilterQuery<IMessage>,
  ): Promise<IMessageModel | null>;
}
