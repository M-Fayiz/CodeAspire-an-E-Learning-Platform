import { ChatbotModel, IChatBotModel } from "../../models/chatbot.model";
import { IChatBot } from "../../types/chatBot.type";
import { BaseRepository } from "../baseRepository";
import { IChatbotRepository } from "../interface/IChatbotRepository";


export class ChatbotRepository extends BaseRepository<IChatBotModel> implements IChatbotRepository{
    constructor(){
        super(ChatbotModel)
    }

    async createChat(chatData: IChatBot): Promise<IChatBotModel> {
        return await this.create(chatData)
    }
}