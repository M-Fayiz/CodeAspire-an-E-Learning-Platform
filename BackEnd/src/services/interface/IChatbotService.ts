import { IChatModel } from "../../models/chat.model";
import { IChatBot } from "../../types/chatBot.type";



export interface IChatbotService{
    createChat(chatData: string): Promise<string>
}