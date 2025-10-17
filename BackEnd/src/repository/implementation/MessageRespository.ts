import { Types, FilterQuery } from "mongoose";
import { IMessageModel, MessageModel } from "../../models/message.model";
import { IMessage } from "../../types/message.type";
import { BaseRepository } from "../baseRepository";
import { IMessageRepository } from "../interface/IMessageRepository";

export class MessageRepository
  extends BaseRepository<IMessageModel>
  implements IMessageRepository
{
  constructor() {
    super(MessageModel);
  }
  async createMessage(data: IMessage): Promise<IMessageModel> {
    return await this.create(data);
  }
  async updateMessage(
    messageId: Types.ObjectId,
    filter: FilterQuery<IMessage>,
  ): Promise<IMessageModel | null> {
    return await this.findByIDAndUpdate(messageId, filter);
  }
  async getChats(
    chatId: Types.ObjectId,
    limit: number,
  ): Promise<IMessageModel[] | null> {
    const filter = {
      chatId: chatId,
    };
    return await this.findAll(filter);
  }
  async readMessage(messageIds: Types.ObjectId[]): Promise<IMessageModel[]> {
    return await this.UpdateMany(
      { _id: { $in: messageIds } },
      { $set: { status: "read" } },
    );
  }
}
