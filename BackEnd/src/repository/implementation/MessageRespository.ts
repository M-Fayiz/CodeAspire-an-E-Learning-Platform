import { IMessageModel, MessageModel } from "../../models/message.model";
import { BaseRepository } from "../baseRepository";
import { IMessageRepository } from "../interface/IMessageRepository";

export class MessageRepository extends BaseRepository<IMessageModel> implements IMessageRepository{
    constructor(){
        super(MessageModel)
    }
    async createMessage(): Promise<IMessageModel> {
        
    }
}