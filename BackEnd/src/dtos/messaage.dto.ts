import { IMessageModel } from "../models/message.model";
import { IMessageDto } from "../types/dtos.type/message.dto.type";


export function MessageDto(data:IMessageModel):IMessageDto{
    return{
        _id:data._id,
        content:data.content,
        mediaUrl:data.mediaUrl,
        createdAt:data.createdAt,
        status:data.status,
        sender:data.sender,
        chatId:data.chatId,
        type:data.type
    }
}