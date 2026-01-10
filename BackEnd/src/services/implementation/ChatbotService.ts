import { IChatModel } from "../../models/chat.model";
import { IChatbotRepository } from "../../repository/interface/IChatbotRepository";
import { IChatBot } from "../../types/chatBot.type";
import { askGemini } from "../../utils/gemini.util";
import { IChatbotService } from "../interface/IChatbotService";


export class ChatbotService implements IChatbotService{

    constructor(private _chatbotRepository:IChatbotRepository){}

    async createChat(prompt: string): Promise<string> {

   

        return await askGemini(prompt);
    }
}