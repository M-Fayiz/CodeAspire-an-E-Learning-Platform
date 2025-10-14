import { IMessageModel, MessageModel } from "../../models/message.model";
import { IMessage } from "../../types/message.type";
import { BaseRepository } from "../baseRepository";
import { IMessageRepository } from "../interface/IMessageRepository";

export class MessageRepository extends BaseRepository<IMessageModel> implements IMessageRepository{
    constructor(){
        super(MessageModel)
    }
    async createMessage(data:IMessage): Promise<IMessageModel> {
        return await this.create(data)
        
    }
}