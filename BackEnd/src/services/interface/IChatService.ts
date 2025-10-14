import { IChatDTO } from "../../types/dtos.type/chat.dto.types";
import { IMessage } from "../../types/message.type";


export interface IChatService{
    getOrCreateRoom(userId1:string,userId2:string):Promise<IChatDTO>
    findChat(chatId:string):Promise<IChatDTO>
    createMessage(data:Partial<IMessage>):Promise<IMessageDto>
}