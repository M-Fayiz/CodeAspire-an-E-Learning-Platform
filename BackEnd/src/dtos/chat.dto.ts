import { IChatModel } from "../models/chat.model";
import { IChatDTO } from "../types/dtos.type/chat.dto.types";


export function chatDto (data:IChatModel):IChatDTO{
    const chat = data.toObject();
    return {
        _id:chat._id,
        participantKey:chat.participantKey,
        users:chat.users,
        latestMessage:chat.latestMessage ?? null,
        createdAt:chat.createdAt
    }

}