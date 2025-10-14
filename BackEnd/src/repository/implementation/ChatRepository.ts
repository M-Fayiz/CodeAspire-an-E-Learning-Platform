import { Types } from "mongoose";
import { ChatModel, IChatModel } from "../../models/chat.model";
import { BaseRepository } from "../baseRepository";
import { IChatRespository } from "../interface/IChatRepository";



export class ChatRepository extends BaseRepository<IChatModel> implements IChatRespository{
    constructor(){
        super(ChatModel)
    }
    async createChat(chatData: Partial<IChatModel>): Promise<IChatModel> {
        return await this.create(chatData)
    }
    async getChat(prticipandtKey: string): Promise<IChatModel | null> {
        return await this.findOne({participantKey:prticipandtKey})
    }
    async findChatId(chatId: Types.ObjectId): Promise<IChatModel | null> {
        return await this.findById(chatId)
    }
}