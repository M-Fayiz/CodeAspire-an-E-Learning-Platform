import { IChatBotModel } from "../../models/chatbot.model";
import { IChatBot } from "../../types/chatBot.type";


export interface IChatbotRepository{
    createChat(chatData:IChatBot):Promise<IChatBotModel>
}