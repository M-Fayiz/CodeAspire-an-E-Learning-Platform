import { IchatbotUser } from "../../types/chatBot.type";
import { IChatbotDTO } from "../../types/dtos.type/chatbot.dto.type";



export interface IChatbotService{
    createChat(chatbotData: IchatbotUser,crntSessionTitle:string,currentLectureTitle:string): Promise<IChatbotDTO>
}