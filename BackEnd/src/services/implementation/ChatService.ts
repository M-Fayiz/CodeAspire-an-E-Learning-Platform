import { HttpResponse } from "../../const/error-message";
import { HttpStatus } from "../../const/http-status";
import { chatDto } from "../../dtos/chat.dto";
import { MessageDto } from "../../dtos/messaage.dto";
import { parseObjectId } from "../../mongoose/objectId";
import { IChatRespository } from "../../repository/interface/IChatRepository";
import { IMessageRepository } from "../../repository/interface/IMessageRepository";
import { IChatDTO } from "../../types/dtos.type/chat.dto.types";
import { IMessageDto } from "../../types/dtos.type/message.dto.type";
import { IMessage } from "../../types/message.type";
import { createHttpError } from "../../utils/http-error";
import { generateParticipantKey } from "../../utils/participantKey.util";
import { IChatService } from "../interface/IChatService";


export class ChatService implements IChatService{
    constructor(private _chatRepository:IChatRespository,private _messageRepository:IMessageRepository){}

    async getOrCreateRoom(userId1: string, userId2: string): Promise<IChatDTO> {
        const user_id1=parseObjectId(userId1)
        const user_id2=parseObjectId(userId2)
        if(!user_id1||!user_id2){
            throw createHttpError(HttpStatus.BAD_REQUEST,HttpResponse.INVALID_ID)
        }
        const participentKey=generateParticipantKey(userId1,userId2)
        
        let chat=await this._chatRepository.getChat(participentKey)
        if(!chat){
            chat=await this._chatRepository.createChat({users:[user_id1,user_id2],participantKey:participentKey})
        }

        return chatDto(chat)
    }
    async findChat(chatId: string): Promise<IChatDTO > {
        const chat_id=parseObjectId(chatId)
         if(!chat_id){
            throw createHttpError(HttpStatus.BAD_REQUEST,HttpResponse.INVALID_ID)
        }
        const chatData=await this._chatRepository.findChatId(chat_id)
        if(!chatData){
            throw createHttpError(HttpStatus.NOT_FOUND,HttpResponse.CHAT_NOT_FOUND)
        }
        return chatDto(chatData)
    }
    async createMessage(data: Partial<IMessage>): Promise<IMessageDto> {
        const createdData=await this._messageRepository.createMessage(data)
        return MessageDto(createdData)
    }

}